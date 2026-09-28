"use client";

import { DAWN_STAGE, ageForStage, biomeForStage, eraForStage, seededRng } from "@idlebound/game";

/**
 * Sound synthesized with WebAudio, no file to load (BIBLE 19): a distinct effect per event,
 * with a rate limit so that frenzy doesn't overwhelm the ears, and under them the ambient
 * drone of the place being walked.
 */
type Sound =
  | "hit"
  | "crit"
  | "kill"
  | "coin"
  | "buy"
  | "boss"
  | "fail"
  | "achievement"
  | "crystal"
  | "loot"
  | "skill"
  | "ascend"
  | "error"
  | "fragment"
  | "recognition"
  | "seam"
  | "descent"
  | "kingWord"
  | "dream"
  | "quiet"
  | "pip";

/** Share of the volume left to every other sound while the Quiet passes. */
const DUCKED = 0.06;
/** Age X, the Unmaking (index 9): sounds arrive late and muffled. */
const UNMAKING_AGE = 9;
const MUFFLED_CUTOFF = 520;
const MUFFLED_DELAY = 0.22;
const OPEN_CUTOFF = 20000;
/** Level of the drone at full ambience: always under the effects. */
const AMBIENCE_LEVEL = 0.32;
/** Crossfade between two places, in seconds. */
const CROSSFADE = 3;
/** Seconds between two steps of the drone's wandering voice. */
const DRIFT_SECONDS = 14;
/** The Dawn: one held note, nothing else. */
const DAWN_NOTE = 220;

interface BiomeDrone {
  /** Fundamental, in Hz. */
  root: number;
  wave: OscillatorType;
  /** Ratio of the second held voice to the root (a fifth, an octave). */
  second: number;
  /** Ratios to the root the wandering voice moves between. */
  colors: readonly number[];
  /** Low-pass cutoff of the drone, in Hz. */
  cutoff: number;
}

/** One drone per biome, in the order of BIOMES. */
const BIOME_DRONES: readonly BiomeDrone[] = [
  // Hearthfields: warm and open, a ninth drifting over a fifth.
  { root: 73.42, wave: "triangle", second: 3 / 2, colors: [2, 9 / 4, 5 / 2, 3], cutoff: 900 },
  // Wychwood: lower, a minor third in the branches.
  { root: 55, wave: "triangle", second: 3 / 2, colors: [2, 12 / 5, 8 / 3, 3], cutoff: 700 },
  // Deepvaults: hollow octaves, the partials of a cave.
  { root: 65.41, wave: "sine", second: 2, colors: [3, 4, 9 / 2, 5], cutoff: 1100 },
  // Mire of Osric: slow water, a tritone under the surface.
  { root: 58.27, wave: "triangle", second: 3 / 2, colors: [32 / 15, 12 / 5, 45 / 16, 3], cutoff: 600 },
  // Orvane Keep: the lowest, a minor second against the stone.
  { root: 49, wave: "sawtooth", second: 3 / 2, colors: [32 / 15, 12 / 5, 3, 16 / 5], cutoff: 480 }
];

/** What the drone of a stage sounds like: pure data, the same on every device. */
export interface DronePlan {
  /** Changes exactly when the drone must change (biome, era, the Dawn). */
  key: string;
  dawn: boolean;
  /** Age X: every sound late and muffled. */
  muffled: boolean;
  root: number;
  wave: OscillatorType;
  second: number;
  /** Cents between the root and its twin: a beating that grows Age after Age. */
  beat: number;
  /** Cents the second and wandering voices drift off true. */
  sour: number;
  cutoff: number;
  /** Hz of the slow sway on the cutoff, and of the breath on the wandering voice. */
  sway: number;
  breath: number;
  /** Ratios the wandering voice walks through, in order, then again. */
  path: number[];
}

function placeKey(stage: number): string {
  return stage >= DAWN_STAGE ? "dawn" : `${biomeForStage(stage).id}:${eraForStage(stage)}`;
}

/** FNV-1a, to seed the engine RNG from a place. */
function hashKey(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 0x01000193);
  return hash >>> 0;
}

/**
 * The drone of a stage (BIBLE 19): each biome its own root, voices and colour; each era its
 * own seeded path and breath; each Age detunes it a little further; Age X muffles it; at the
 * Dawn only a held note is left.
 */
export function dronePlan(stage: number): DronePlan {
  const key = placeKey(stage);
  const biome = biomeForStage(stage);
  const age = ageForStage(stage);
  const drone = BIOME_DRONES[biome.index % BIOME_DRONES.length];
  const rng = seededRng(hashKey(key));
  const path = Array.from({ length: 8 }, () => drone.colors[Math.floor(rng() * drone.colors.length)]);
  const dawn = key === "dawn";
  const muffled = !dawn && age === UNMAKING_AGE;
  return {
    key,
    dawn,
    muffled,
    root: dawn ? DAWN_NOTE : drone.root,
    wave: dawn ? "sine" : drone.wave,
    second: drone.second,
    beat: dawn ? 0 : 1.5 + age * 4,
    sour: dawn ? 0 : age * 3.5,
    cutoff: muffled ? Math.min(drone.cutoff, 320) : drone.cutoff,
    sway: 0.025 + rng() * 0.04,
    breath: 0.05 + rng() * 0.06,
    path
  };
}

/** A drone playing: its nodes, and where its wandering voice is. */
interface Drone {
  plan: DronePlan;
  out: GainNode;
  sources: OscillatorNode[];
  color: OscillatorNode | null;
  step: number;
}

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Every effect but the Quiet's goes through this bus, which the Quiet turns down. */
  private bus: GainNode | null = null;
  /** Effects volume (silent at the Dawn). */
  private fx: GainNode | null = null;
  /** The drone's own bus, turned down by the Quiet too. */
  private ambientDuck: GainNode | null = null;
  /** Ambience volume. */
  private ambient: GainNode | null = null;
  /** Age X: a low-pass and a delay over everything. */
  private muffle: BiquadFilterNode | null = null;
  private late: DelayNode | null = null;
  private drone: Drone | null = null;
  private plan: DronePlan = dronePlan(1);
  private noise: AudioBuffer | null = null;
  private lastPlayed = new Map<Sound, number>();
  private enabled = true;
  /** The page is out of sight. */
  private hidden = false;
  volume = 0.6;
  ambience = 0.5;

  /** Sound on or off: while off (and while the page is hidden) the context sleeps. */
  setEnabled(enabled: boolean) {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    this.wake();
  }

  setHidden(hidden: boolean) {
    if (hidden === this.hidden) return;
    this.hidden = hidden;
    this.wake();
  }

  /** Runs the context while sound is on and the page seen, suspends it otherwise. */
  private wake() {
    const ctx = this.context;
    if (!ctx) return;
    if (this.enabled && !this.hidden) {
      if (ctx.state === "suspended") void ctx.resume();
    } else if (ctx.state === "running") {
      void ctx.suspend();
    }
  }

  /** Browsers require a user gesture before producing sound: only asked while sound is on. */
  unlock() {
    if (!this.enabled) return;
    if (this.context) {
      this.wake();
      return;
    }
    try {
      const ctx = new AudioContext();
      this.context = ctx;
      // effects → bus (Quiet) → fx (volume) ┐
      // drone → ambientDuck (Quiet) → ambient ┴→ muffle → late → master
      this.master = ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(ctx.destination);
      this.late = ctx.createDelay(1);
      this.late.delayTime.value = this.plan.muffled ? MUFFLED_DELAY : 0;
      this.late.connect(this.master);
      this.muffle = ctx.createBiquadFilter();
      this.muffle.type = "lowpass";
      this.muffle.frequency.value = this.plan.muffled ? MUFFLED_CUTOFF : OPEN_CUTOFF;
      this.muffle.connect(this.late);
      this.fx = ctx.createGain();
      this.fx.gain.value = this.plan.dawn ? 0 : this.volume;
      this.fx.connect(this.muffle);
      this.bus = ctx.createGain();
      this.bus.connect(this.fx);
      this.ambient = ctx.createGain();
      this.ambient.gain.value = this.ambience * AMBIENCE_LEVEL;
      this.ambient.connect(this.muffle);
      this.ambientDuck = ctx.createGain();
      this.ambientDuck.connect(this.ambient);
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      this.noise = buffer;
      // The drone's wandering voice moves every few seconds: a timer, no per-frame work.
      setInterval(() => this.drift(), DRIFT_SECONDS * 1000);
      this.refresh();
    } catch {
      this.context = null;
    }
  }

  setVolume(volume: number) {
    if (volume === this.volume) return;
    this.volume = volume;
    this.refresh();
  }

  /** Ambience volume: 0 stops the drone. */
  setAmbience(ambience: number) {
    if (ambience === this.ambience) return;
    this.ambience = ambience;
    this.refresh();
  }

  /** The stage walked: the drone follows its biome, era and Age. */
  setStage(stage: number) {
    if (placeKey(stage) === this.plan.key) return;
    this.plan = dronePlan(stage);
    this.refresh();
  }

  /** Brings the graph to the current place and volumes, crossfading the drone if it changed. */
  private refresh() {
    const ctx = this.context;
    if (!ctx || !this.fx || !this.ambient || !this.muffle || !this.late) return;
    const now = ctx.currentTime;
    const plan = this.plan;
    this.fx.gain.setTargetAtTime(plan.dawn ? 0 : this.volume, now, 0.3);
    this.ambient.gain.setTargetAtTime(this.ambience * AMBIENCE_LEVEL, now, 0.15);
    this.muffle.frequency.setTargetAtTime(plan.muffled ? MUFFLED_CUTOFF : OPEN_CUTOFF, now, 0.6);
    this.late.delayTime.setTargetAtTime(plan.muffled ? MUFFLED_DELAY : 0, now, 0.6);
    const wanted = this.ambience > 0 ? plan : null;
    if (this.drone?.plan.key === wanted?.key) return;
    if (this.drone) this.release(this.drone);
    this.drone = wanted ? this.startDrone(wanted) : null;
  }

  /** Six oscillators at most (one at the Dawn), all motion done by the audio thread. */
  private startDrone(plan: DronePlan): Drone | null {
    const ctx = this.context;
    if (!ctx || !this.ambientDuck) return null;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(1, now + CROSSFADE);
    out.connect(this.ambientDuck);
    const sources: OscillatorNode[] = [];
    const voice = (frequency: number, type: OscillatorType, detune: number, level: number, into: AudioNode | AudioParam) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      const gain = ctx.createGain();
      gain.gain.value = level;
      osc.connect(gain);
      if (into instanceof AudioParam) gain.connect(into);
      else gain.connect(into);
      osc.start(now);
      sources.push(osc);
      return osc;
    };
    if (plan.dawn) {
      voice(plan.root, "sine", 0, 0.5, out);
      return { plan, out, sources, color: null, step: 0 };
    }
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = plan.cutoff;
    filter.Q.value = 0.7;
    filter.connect(out);
    voice(plan.root, plan.wave, 0, 0.45, filter);
    voice(plan.root, plan.wave, plan.beat, 0.3, filter);
    voice(plan.root * plan.second, "sine", -plan.sour, 0.22, filter);
    const colorGain = ctx.createGain();
    colorGain.gain.value = 0.07;
    colorGain.connect(filter);
    const color = voice(plan.root * plan.path[0], "sine", plan.sour * 1.5, 1, colorGain);
    // Slow breaths: one sways the cutoff, one swells the wandering voice.
    voice(plan.sway, "sine", 0, plan.cutoff * 0.35, filter.frequency);
    voice(plan.breath, "sine", 0, 0.05, colorGain.gain);
    return { plan, out, sources, color, step: 0 };
  }

  private release(drone: Drone) {
    const ctx = this.context;
    if (!ctx) return;
    const now = ctx.currentTime;
    const gain = drone.out.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(Math.max(gain.value, 0.0001), now);
    gain.exponentialRampToValueAtTime(0.0001, now + CROSSFADE);
    for (const source of drone.sources) source.stop(now + CROSSFADE + 0.1);
  }

  /** The wandering voice glides to the next note of its era's path. */
  private drift() {
    const ctx = this.context;
    const drone = this.drone;
    if (!ctx || ctx.state !== "running" || !drone?.color) return;
    drone.step += 1;
    const ratio = drone.plan.path[drone.step % drone.plan.path.length];
    drone.color.frequency.setTargetAtTime(drone.plan.root * ratio, ctx.currentTime, 2.5);
  }

  /** Everything else goes quiet for a while, then comes back. */
  duck(ms: number) {
    const ctx = this.context;
    if (!ctx) return;
    const start = ctx.currentTime;
    for (const node of [this.bus, this.ambientDuck]) {
      if (!node) continue;
      const gain = node.gain;
      gain.cancelScheduledValues(start);
      gain.setValueAtTime(gain.value, start);
      gain.linearRampToValueAtTime(DUCKED, start + 0.12);
      gain.setValueAtTime(DUCKED, start + ms / 1000);
      gain.linearRampToValueAtTime(1, start + ms / 1000 + 0.6);
    }
  }

  private tone(frequency: number, duration: number, options: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number; attack?: number; direct?: boolean } = {}) {
    const ctx = this.context;
    const out = options.direct ? this.fx : this.bus;
    if (!ctx || !out) return;
    const start = ctx.currentTime + (options.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = options.type ?? "sine";
    osc.frequency.setValueAtTime(frequency, start);
    if (options.slideTo) osc.frequency.exponentialRampToValueAtTime(options.slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(options.gain ?? 0.3, start + (options.attack ?? 0.008));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private burst(duration: number, filterFrequency: number, gainValue: number, delay = 0, slideTo?: number) {
    const ctx = this.context;
    if (!ctx || !this.bus || !this.noise) return;
    const start = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(filterFrequency, start);
    if (slideTo) filter.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.bus);
    source.start(start);
    source.stop(start + duration);
  }

  play(sound: Sound) {
    // At the Dawn the only sound is the held note.
    if (!this.enabled || this.plan.dawn || !this.context || this.context.state !== "running") return;
    const now = performance.now();
    const minGap = sound === "hit" ? 45 : sound === "coin" ? 60 : sound === "crit" ? 70 : 30;
    if (now - (this.lastPlayed.get(sound) ?? 0) < minGap) return;
    this.lastPlayed.set(sound, now);
    const pitch = 0.94 + Math.random() * 0.12;

    switch (sound) {
      case "hit":
        this.burst(0.07, 1800 * pitch, 0.35);
        this.tone(140 * pitch, 0.08, { type: "triangle", gain: 0.25, slideTo: 70 });
        break;
      case "crit":
        this.burst(0.12, 3200, 0.45);
        this.tone(520 * pitch, 0.18, { type: "square", gain: 0.12, slideTo: 260 });
        this.tone(95, 0.16, { type: "sine", gain: 0.4, slideTo: 45 });
        break;
      case "kill":
        this.tone(330 * pitch, 0.18, { type: "triangle", gain: 0.2, slideTo: 110 });
        this.burst(0.18, 600, 0.25);
        break;
      case "coin":
        this.tone(1320 * pitch, 0.08, { type: "square", gain: 0.06 });
        this.tone(1760 * pitch, 0.14, { type: "square", gain: 0.06, delay: 0.06 });
        break;
      case "buy":
        this.tone(660, 0.08, { type: "triangle", gain: 0.18 });
        this.tone(990, 0.12, { type: "triangle", gain: 0.16, delay: 0.05 });
        break;
      case "skill":
        this.tone(440, 0.35, { type: "sawtooth", gain: 0.08, slideTo: 880 });
        this.burst(0.3, 2400, 0.15);
        break;
      case "boss":
        this.tone(73, 0.9, { type: "sawtooth", gain: 0.12 });
        this.tone(110, 0.9, { type: "sine", gain: 0.2, delay: 0.1 });
        break;
      case "fail":
        this.tone(330, 0.25, { type: "triangle", gain: 0.2 });
        this.tone(247, 0.25, { type: "triangle", gain: 0.2, delay: 0.2 });
        this.tone(165, 0.5, { type: "triangle", gain: 0.2, delay: 0.4 });
        break;
      case "achievement":
        [523, 659, 784, 1046].forEach((frequency, index) => this.tone(frequency, 0.3, { type: "triangle", gain: 0.16, delay: index * 0.09 }));
        break;
      case "crystal":
        [1568, 2093, 2637, 3136].forEach((frequency, index) => this.tone(frequency, 0.4, { type: "sine", gain: 0.08, delay: index * 0.05 }));
        break;
      case "loot":
        this.tone(784, 0.2, { type: "triangle", gain: 0.15 });
        this.tone(1175, 0.35, { type: "triangle", gain: 0.15, delay: 0.1 });
        break;
      case "ascend":
        [262, 330, 392, 523, 659, 784, 1046].forEach((frequency, index) => this.tone(frequency, 0.6, { type: "sine", gain: 0.12, delay: index * 0.1 }));
        break;
      case "error":
        this.tone(180, 0.12, { type: "square", gain: 0.08 });
        break;
      case "fragment":
        // Two soft bell notes.
        this.tone(1175, 0.9, { type: "sine", gain: 0.09 });
        this.tone(1568, 1.1, { type: "sine", gain: 0.07, delay: 0.22 });
        break;
      case "recognition":
        // A rising third.
        this.tone(392, 0.5, { type: "triangle", gain: 0.12 });
        this.tone(494, 0.7, { type: "triangle", gain: 0.12, delay: 0.18 });
        break;
      case "seam":
        // Something tears, then a chord closes it.
        this.burst(0.28, 900, 0.3, 0, 4200);
        this.burst(0.2, 2600, 0.18, 0.12, 700);
        [220, 277, 330].forEach((frequency) => this.tone(frequency, 1.1, { type: "triangle", gain: 0.09, delay: 0.42 }));
        break;
      case "descent":
        // A long fall, one thread lower.
        this.tone(880, 3.2, { type: "triangle", gain: 0.12, slideTo: 55, attack: 0.2 });
        this.tone(1320, 2.6, { type: "sine", gain: 0.05, slideTo: 82, attack: 0.3, delay: 0.25 });
        break;
      case "kingWord":
        // One low note.
        this.tone(65, 2.4, { type: "triangle", gain: 0.22, attack: 0.05 });
        break;
      case "dream":
        // A slow chord, no attack.
        [196, 247, 294, 370].forEach((frequency, index) => this.tone(frequency, 3.6, { type: "sine", gain: 0.05, attack: 1.2, delay: index * 0.15 }));
        break;
      case "quiet":
        // Everything else goes still; only a faint breath remains.
        this.duck(2000);
        this.tone(1760, 1.6, { type: "sine", gain: 0.015, attack: 0.4, direct: true });
        break;
      case "pip":
        // A squeak, then a coin.
        this.tone(1900 * pitch, 0.07, { type: "square", gain: 0.05, slideTo: 2600 });
        this.tone(2300 * pitch, 0.06, { type: "square", gain: 0.04, slideTo: 3000, delay: 0.08 });
        this.tone(1320, 0.08, { type: "square", gain: 0.06, delay: 0.22 });
        this.tone(1760, 0.16, { type: "square", gain: 0.06, delay: 0.28 });
        break;
    }
  }
}

export const audio = new AudioEngine();
export type { Sound };
