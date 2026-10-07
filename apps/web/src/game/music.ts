/**
 * The music of the Ledger's scenes (BIBLE 19), synthesized like every sound of the game: the
 * Dusk theme, one melody the walker hears whenever the Ledger tells a moment. A hook of four
 * notes climbing from A to F, answered, broken off, then come back to D. The scene plays it
 * whole as it opens, and a slower reprise on a music box once the worst is over.
 *
 * A melody is written a quarter note per token, four to a bar: a note (`A4`, `C#5`), `-` to
 * hold the one before, `.` for a rest.
 */
export type MusicCue = "theme" | "reprise" | "hush";

const SEMITONES: Record<string, number> = { C: 0, "C#": 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };

/** A note's pitch in Hz (A4 is 440). */
export function noteHz(note: string): number {
  const match = /^([A-G](?:#|b)?)(\d)$/.exec(note);
  if (!match) throw new Error(`Not a note: ${note}`);
  const midi = (Number(match[2]) + 1) * 12 + SEMITONES[match[1]];
  return 440 * 2 ** ((midi - 69) / 12);
}

/** The chords of the theme, from the bass up. */
const CHORDS: Record<string, readonly string[]> = {
  Dm: ["D3", "F3", "A3"],
  C: ["C3", "E3", "G3"],
  F: ["F3", "A3", "C4"],
  A: ["A2", "C#3", "E3"],
  Gm: ["G2", "Bb2", "D3"],
  Bb: ["Bb2", "D3", "F3"]
};

interface Bar {
  chord: keyof typeof CHORDS;
  melody: string;
}

/** The Dusk theme: the hook, its answer, a bridge that rises, and the hook come home. */
const THEME: readonly Bar[] = [
  { chord: "Dm", melody: "A4 D5 E5 F5" },
  { chord: "C", melody: "E5 - D5 -" },
  { chord: "F", melody: "C5 D5 A4 -" },
  { chord: "A", melody: "- - . ." },
  { chord: "Dm", melody: "A4 D5 E5 F5" },
  { chord: "Gm", melody: "G5 - F5 E5" },
  { chord: "C", melody: "F5 - E5 C5" },
  { chord: "Dm", melody: "D5 - - ." },
  { chord: "Bb", melody: "F5 - D5 -" },
  { chord: "Gm", melody: "G5 F5 D5 Bb4" },
  { chord: "F", melody: "C5 - A4 C5" },
  { chord: "A", melody: "E5 - - ." },
  { chord: "Dm", melody: "A4 D5 E5 F5" },
  { chord: "F", melody: "A5 - G5 F5" },
  { chord: "A", melody: "E5 - C#5 E5" },
  { chord: "Dm", melody: "D5 - - -" }
];

export interface Piece {
  bpm: number;
  bars: readonly Bar[];
  /** The voice of the melody: a soft square lead, or a music box an octave up. */
  lead: "pulse" | "box";
  /** Chords broken into eighths under the melody (the reprise only holds them). */
  arpeggio: boolean;
}

export const PIECES: Record<Exclude<MusicCue, "hush">, Piece> = {
  theme: { bpm: 84, bars: THEME, lead: "pulse", arpeggio: true },
  // The hook come home, slower, alone on a music box.
  reprise: { bpm: 72, bars: THEME.slice(12), lead: "box", arpeggio: false }
};

/** A note of a melody: its pitch, and when it starts and ends, in beats from the piece's start. */
export interface Note {
  note: string;
  from: number;
  to: number;
}

/** The notes of a melody, each held through its `-` and cut by a rest or the next note. */
export function melodyNotes(bars: readonly Bar[]): Note[] {
  const tokens = bars.flatMap((bar) => bar.melody.split(" "));
  const notes: Note[] = [];
  tokens.forEach((token, beat) => {
    if (token === "-") {
      const last = notes[notes.length - 1];
      if (last && last.to === beat) last.to = beat + 1;
    } else if (token !== ".") notes.push({ note: token, from: beat, to: beat + 1 });
  });
  return notes;
}

/** Eighths of a bar's broken chord: indices into root, third, fifth, then the root and third an octave up. */
const ARPEGGIO = [0, 2, 3, 4, 2, 3, 4, 3];

/**
 * Lays a piece out on the audio graph from `start`, into `out`: every note scheduled at once.
 * Returns its oscillators, for the caller to stop when the music ends early.
 */
export function schedulePiece(ctx: AudioContext, out: AudioNode, piece: Piece, start: number): OscillatorNode[] {
  const beat = 60 / piece.bpm;
  const nodes: OscillatorNode[] = [];
  const voice = (frequency: number, type: OscillatorType, from: number, length: number, level: number, release: number, target: AudioNode = out) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, from);
    gain.gain.exponentialRampToValueAtTime(level, from + 0.012);
    gain.gain.exponentialRampToValueAtTime(level * 0.6, from + 0.18);
    gain.gain.setValueAtTime(level * 0.6, from + Math.max(0.19, length));
    gain.gain.exponentialRampToValueAtTime(0.0001, from + Math.max(0.19, length) + release);
    osc.connect(gain).connect(target);
    osc.start(from);
    osc.stop(from + Math.max(0.19, length) + release + 0.02);
    nodes.push(osc);
    return osc;
  };
  // The lead goes through a soft low-pass, so the square sings instead of buzzing.
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = piece.lead === "pulse" ? 2200 : 5000;
  tone.connect(out);
  for (const { note, from, to } of melodyNotes(piece.bars)) {
    const at = start + from * beat;
    const length = (to - from) * beat;
    if (piece.lead === "box") {
      // A music box: struck, never held, ringing out.
      voice(noteHz(note) * 2, "triangle", at, 0.02, 0.07, length + 0.9, tone);
      voice(noteHz(note) * 4, "sine", at, 0.02, 0.012, 0.6, tone);
    } else {
      const osc = voice(noteHz(note), "square", at, length - 0.06, 0.035, 0.12, tone);
      // A slow vibrato comes in on the long notes.
      if (length > beat * 1.5) {
        const lfo = ctx.createOscillator();
        const depth = ctx.createGain();
        lfo.frequency.value = 5;
        depth.gain.setValueAtTime(0, at);
        depth.gain.linearRampToValueAtTime(9, at + length);
        lfo.connect(depth).connect(osc.detune);
        lfo.start(at);
        lfo.stop(at + length + 0.2);
        nodes.push(lfo);
      }
    }
  }
  piece.bars.forEach((bar, index) => {
    const at = start + index * 4 * beat;
    const [root, third, fifth] = CHORDS[bar.chord].map(noteHz);
    voice(root / 2, "triangle", at, 4 * beat - 0.1, 0.08, 0.3);
    if (piece.arpeggio) {
      const tones = [root, third, fifth, root * 2, third * 2];
      ARPEGGIO.forEach((step, eighth) => voice(tones[step], "sine", at + (eighth * beat) / 2, 0.05, 0.022, beat * 0.8));
    } else {
      for (const frequency of [root, third, fifth]) voice(frequency, "sine", at, 4 * beat - 0.2, 0.016, 0.8);
    }
  });
  return nodes;
}

/** A piece's length, in seconds. */
export const pieceSeconds = (piece: Piece) => (piece.bars.length * 4 * 60) / piece.bpm;
