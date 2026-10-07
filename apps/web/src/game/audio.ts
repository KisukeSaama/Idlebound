"use client";

import { DAWN_STAGE, ageForEra, drawnEraForStage } from "@idlebound/game";
import { PIECES, schedulePiece, type MusicCue } from "./music";

/**
 * Sound synthesized with WebAudio, no file to load (BIBLE 19): a distinct effect per event,
 * with a rate limit so that frenzy doesn't overwhelm the ears.
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
  | "pip"
  | "rattle"
  | "unseal"
  | "tick"
  | "found"
  | "blow";

const MASTER_GAIN = 0.5;
/** Share of the volume left to every other sound while the Quiet passes. */
const DUCKED = 0.06;
/** Age X, the Unmaking (index 9): sounds arrive late and muffled. */
const UNMAKING_AGE = 9;
const MUFFLED_CUTOFF = 520;
const MUFFLED_DELAY = 0.22;
const OPEN_CUTOFF = 20000;

/**
 * How the stage walked colours every sound: Age X muffles them (each time the night draws it
 * again), the Dawn at stage 3000 silences them.
 */
interface Place {
  dawn: boolean;
  muffled: boolean;
}

function placeFor(stage: number): Place {
  const dawn = stage === DAWN_STAGE;
  return { dawn, muffled: !dawn && ageForEra(drawnEraForStage(stage)) === UNMAKING_AGE };
}

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Every effect but the Quiet's goes through this bus, which the Quiet turns down. */
  private bus: GainNode | null = null;
  /** Effects volume (silent at the Dawn). */
  private fx: GainNode | null = null;
  /** Age X: a low-pass and a delay over everything. */
  private muffle: BiquadFilterNode | null = null;
  private late: DelayNode | null = null;
  private place: Place = placeFor(1);
  private noise: AudioBuffer | null = null;
  private lastPlayed = new Map<Sound, number>();
  /** A scene of the Ledger is playing: its sounds pass over the duck. */
  private scene = false;
  /** The music of a scene, while it plays. */
  private score: { nodes: OscillatorNode[]; gain: GainNode } | null = null;
  private cueing = false;
  private enabled = true;
  /** The page is out of sight. */
  private hidden = false;
  volume = 0.6;

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
      // effects → bus (Quiet) → fx (volume) → muffle → late → master
      this.master = ctx.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(ctx.destination);
      this.late = ctx.createDelay(1);
      this.late.delayTime.value = this.place.muffled ? MUFFLED_DELAY : 0;
      this.late.connect(this.master);
      this.muffle = ctx.createBiquadFilter();
      this.muffle.type = "lowpass";
      this.muffle.frequency.value = this.place.muffled ? MUFFLED_CUTOFF : OPEN_CUTOFF;
      this.muffle.connect(this.late);
      this.fx = ctx.createGain();
      this.fx.gain.value = this.place.dawn ? 0 : this.volume;
      this.fx.connect(this.muffle);
      this.bus = ctx.createGain();
      this.bus.connect(this.fx);
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      this.noise = buffer;
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

  /** The stage walked: Age X muffles every sound, the Dawn silences them. */
  setStage(stage: number) {
    const place = placeFor(stage);
    if (place.dawn === this.place.dawn && place.muffled === this.place.muffled) return;
    this.place = place;
    this.refresh();
  }

  /** Brings the graph to the current place and volume. */
  private refresh() {
    const ctx = this.context;
    if (!ctx || !this.fx || !this.muffle || !this.late) return;
    const now = ctx.currentTime;
    const place = this.place;
    this.fx.gain.setTargetAtTime(place.dawn ? 0 : this.volume, now, 0.3);
    this.muffle.frequency.setTargetAtTime(place.muffled ? MUFFLED_CUTOFF : OPEN_CUTOFF, now, 0.6);
    this.late.delayTime.setTargetAtTime(place.muffled ? MUFFLED_DELAY : 0, now, 0.6);
  }

  /** Every sound fades out (the page is about to move on), or comes back. */
  hush(hushed: boolean) {
    const ctx = this.context;
    if (!ctx || !this.master) return;
    this.master.gain.setTargetAtTime(hushed ? 0 : MASTER_GAIN, ctx.currentTime, 0.15);
  }

  /** Everything else goes quiet for a while, then comes back. */
  duck(ms: number) {
    const ctx = this.context;
    // A scene keeps the night quiet already, until it ends.
    if (!ctx || !this.bus || this.scene) return;
    const start = ctx.currentTime;
    const gain = this.bus.gain;
    gain.cancelScheduledValues(start);
    gain.setValueAtTime(gain.value, start);
    gain.linearRampToValueAtTime(DUCKED, start + 0.12);
    gain.setValueAtTime(DUCKED, start + ms / 1000);
    gain.linearRampToValueAtTime(1, start + ms / 1000 + 0.6);
  }

  private tone(frequency: number, duration: number, options: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number; attack?: number; direct?: boolean } = {}) {
    const ctx = this.context;
    const out = options.direct || this.cueing ? this.fx : this.bus;
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
    const out = this.cueing ? this.fx : this.bus;
    if (!ctx || !out || !this.noise) return;
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
    source.connect(filter).connect(gain).connect(out);
    source.start(start);
    source.stop(start + duration);
  }

  /**
   * A scene of the Ledger begins or ends: the night beneath goes quiet while it plays, and
   * its music fades when it ends.
   */
  setScene(playing: boolean) {
    const ctx = this.context;
    if (!ctx || !this.bus || playing === this.scene) return;
    this.scene = playing;
    const now = ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setTargetAtTime(playing ? DUCKED : 1, now, playing ? 0.2 : 0.5);
    if (!playing) this.silence(1.2);
  }

  /** The music of a scene: the Dusk theme, its reprise, or a cut to silence (a blow). */
  music(cue: MusicCue) {
    const ctx = this.context;
    if (!this.enabled || this.place.dawn || !ctx || ctx.state !== "running" || !this.fx) return;
    this.silence(cue === "hush" ? 0.06 : 0.4);
    if (cue === "hush") return;
    const gain = ctx.createGain();
    gain.connect(this.fx);
    this.score = { nodes: schedulePiece(ctx, gain, PIECES[cue], ctx.currentTime + 0.05), gain };
  }

  /** The music playing goes quiet over `seconds`, then stops. */
  private silence(seconds: number) {
    const ctx = this.context;
    const score = this.score;
    if (!ctx || !score) return;
    this.score = null;
    const now = ctx.currentTime;
    score.gain.gain.cancelScheduledValues(now);
    score.gain.gain.setValueAtTime(score.gain.gain.value, now);
    score.gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    for (const node of score.nodes) {
      try {
        node.stop(now + seconds + 0.05);
      } catch {
        // A note already over.
      }
    }
  }

  /** A sound of a scene: it plays over the quiet the scene keeps. */
  cue(sound: Sound) {
    this.cueing = true;
    try {
      this.play(sound);
    } finally {
      this.cueing = false;
    }
  }

  /** `step`: how far up a climbing sound has gone (a chest's knocks, the rarity it opens on). */
  play(sound: Sound, step = 0) {
    // At the Dawn, nothing sounds.
    if (!this.enabled || this.place.dawn || !this.context || this.context.state !== "running") return;
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
      case "rattle":
        // A knock on old wood, a little higher each time, and a chime once past the first.
        this.burst(0.07, 700 * pitch, 0.3);
        this.tone(120 * (1 + step * 0.15), 0.1, { type: "triangle", gain: 0.28, slideTo: 70 });
        if (step > 0) this.tone(523 * 2 ** (step / 3), 0.25, { type: "triangle", gain: 0.08, delay: 0.03 });
        break;
      case "unseal":
        // The lid bursts.
        this.burst(0.35, 1400, 0.32, 0, 5200);
        this.tone(90, 0.3, { type: "sine", gain: 0.35, slideTo: 45 });
        break;
      case "tick":
        // A relic of the reel passes the gold marks.
        this.tone(2200 * pitch, 0.025, { type: "square", gain: 0.035 });
        break;
      case "blow":
        // A sword through the air, the impact, and the ring of the steel after it.
        this.burst(0.16, 500, 0.3, 0, 3800);
        this.tone(88, 0.7, { type: "sine", gain: 0.5, slideTo: 32, delay: 0.1 });
        this.burst(0.3, 1200, 0.4, 0.1, 300);
        this.tone(1244, 1.4, { type: "triangle", gain: 0.05, delay: 0.12 });
        this.tone(1661, 1.1, { type: "sine", gain: 0.03, delay: 0.14 });
        break;
      case "found":
        // The reel stops: a chord rises, one note longer for each rarity up.
        [523, 659, 784, 1046, 1319].slice(0, 2 + step).forEach((frequency, index) => this.tone(frequency, 0.5 + step * 0.1, { type: "triangle", gain: 0.12, delay: index * 0.07 }));
        break;
    }
  }
}

export const audio = new AudioEngine();
export type { Sound };
