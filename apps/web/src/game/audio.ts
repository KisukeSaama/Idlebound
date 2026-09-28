"use client";

/**
 * Sound effects synthesized with WebAudio: no file to load, a distinct sound per event,
 * and a rate limit so that frenzy doesn't overwhelm the ears.
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

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Every sound but the Quiet's goes through this bus, which the Quiet turns down. */
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private lastPlayed = new Map<Sound, number>();
  enabled = true;
  volume = 0.6;

  /** Browsers require a user gesture before producing sound. */
  unlock() {
    if (this.context) {
      if (this.context.state === "suspended") void this.context.resume();
      return;
    }
    try {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume * 0.5;
      this.master.connect(this.context.destination);
      this.bus = this.context.createGain();
      this.bus.connect(this.master);
      const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.3, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      this.noise = buffer;
    } catch {
      this.context = null;
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.master) this.master.gain.value = volume * 0.5;
  }

  /** Everything else goes quiet for a while, then comes back. */
  duck(ms: number) {
    const ctx = this.context;
    if (!ctx || !this.bus) return;
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
    const out = options.direct ? this.master : this.bus;
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
    if (!this.enabled || !this.context || this.context.state !== "running") return;
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
