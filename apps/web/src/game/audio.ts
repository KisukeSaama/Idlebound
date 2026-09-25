"use client";

/**
 * Sound effects synthesized with WebAudio: no file to load, a distinct sound per event,
 * and a rate limit so that frenzy doesn't overwhelm the ears.
 */
type Sound = "hit" | "crit" | "kill" | "coin" | "buy" | "boss" | "fail" | "achievement" | "crystal" | "loot" | "skill" | "ascend" | "error";

class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
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

  private tone(frequency: number, duration: number, options: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number } = {}) {
    const ctx = this.context;
    if (!ctx || !this.master) return;
    const start = ctx.currentTime + (options.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = options.type ?? "sine";
    osc.frequency.setValueAtTime(frequency, start);
    if (options.slideTo) osc.frequency.exponentialRampToValueAtTime(options.slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(options.gain ?? 0.3, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private burst(duration: number, filterFrequency: number, gainValue: number, delay = 0) {
    const ctx = this.context;
    if (!ctx || !this.master || !this.noise) return;
    const start = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFrequency;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.master);
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
    }
  }
}

export const audio = new AudioEngine();
export type { Sound };
