// beat.ts — Persistent Beat Engine: JSON-driven with crossfade
// Run once: npx tsx beat.ts
// Change beat: write to mood.json (preset or custom definition)
import {
  AudioContext, OscillatorNode, GainNode, BiquadFilterNode,
} from 'node-web-audio-api'
import { watch, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const ctx = new AudioContext()
const master = new GainNode(ctx, { gain: 0.75 })
master.connect(ctx.destination)
const MOOD_FILE = resolve('./mood.json')
const DEFAULT_CROSSFADE = 8

// ═══ NOTE HELPER ══════════════════════════════════════════════
// Accepts "A4" (note name) or 440 (raw frequency)
type Note = string | number
const ST: Record<string, number> = {
  'C':-9,'C#':-8,'Db':-8,'D':-7,'D#':-6,'Eb':-6,'E':-5,
  'F':-4,'F#':-3,'Gb':-3,'G':-2,'G#':-1,'Ab':-1,'A':0,'A#':1,'Bb':1,'B':2
}
function N(n: Note | null): number | null {
  if (n === null || n === undefined) return null
  if (typeof n === 'number') return n
  const m = n.match(/^([A-G][#b]?)(\d)$/)
  if (!m) return 440
  return 440 * Math.pow(2, (ST[m[1]] + (parseInt(m[2]) - 4) * 12) / 12)
}
function NN(n: Note): number { return N(n) || 440 }

// ═══ MOOD CONTEXT ═════════════════════════════════════════════
class MoodCtx {
  bus: GainNode
  private timers = new Set<ReturnType<typeof setTimeout>>()
  private oscs: OscillatorNode[] = []
  alive = true
  constructor(public label: string) {
    this.bus = new GainNode(ctx, { gain: 0 })
    this.bus.connect(master)
  }
  after(ms: number, fn: () => void) {
    if (!this.alive) return
    const id = setTimeout(() => { this.timers.delete(id); if (this.alive) fn() }, ms)
    this.timers.add(id)
  }
  keep(osc: OscillatorNode) { this.oscs.push(osc) }
  destroy() {
    this.alive = false
    this.timers.forEach(id => clearTimeout(id)); this.timers.clear()
    this.oscs.forEach(o => { try { o.stop() } catch {} }); this.oscs = []
    try { this.bus.disconnect() } catch {}
  }
}

// ═══ SYNTH PRIMITIVES ═════════════════════════════════════════
function stepLoop(m: MoodCtx, ms: number, len: number, fn: (s: number) => void) {
  let step = 0
  function tick() { fn(step % len); step++; m.after(ms, tick) }
  tick()
}

function synthKick(bus: GainNode, now: number,
  sf = 160, ef = 38, sw = 0.08, gn = 0.30, dec = 0.35, clk = true) {
  const o = new OscillatorNode(ctx, { type: 'sine', frequency: sf })
  const g = new GainNode(ctx, { gain: 0 })
  o.connect(g); g.connect(bus)
  o.frequency.setValueAtTime(sf, now)
  o.frequency.exponentialRampToValueAtTime(ef, now + sw)
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(gn, now + 0.003)
  g.gain.exponentialRampToValueAtTime(0.001, now + dec)
  o.start(now); o.stop(now + dec)
  if (clk) {
    const c = new OscillatorNode(ctx, { type: 'square', frequency: 2500 })
    const cg = new GainNode(ctx, { gain: 0 })
    c.connect(cg); cg.connect(bus)
    cg.gain.setValueAtTime(0.08, now)
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.01)
    c.start(now); c.stop(now + 0.01)
  }
}

function synthHat(bus: GainNode, now: number, vel: number,
  dec = 0.04, f1 = 6500, f2 = 7350, hp = 8000) {
  const o1 = new OscillatorNode(ctx, { type: 'square', frequency: f1 })
  const o2 = new OscillatorNode(ctx, { type: 'square', frequency: f2 })
  const g = new GainNode(ctx, { gain: 0 })
  const f = new BiquadFilterNode(ctx, { type: 'highpass', frequency: hp, Q: 1 })
  o1.connect(g); o2.connect(g); g.connect(f); f.connect(bus)
  g.gain.setValueAtTime(0.025 * vel, now)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dec)
  o1.start(now); o2.start(now); o1.stop(now + dec); o2.stop(now + dec)
}

function synthSnare(bus: GainNode, now: number, gn = 0.04, dec = 0.12) {
  for (const freq of [3100, 3700, 4300, 5100, 5800]) {
    const o = new OscillatorNode(ctx, { type: 'square', frequency: freq })
    const g = new GainNode(ctx, { gain: 0 })
    o.connect(g); g.connect(bus)
    g.gain.setValueAtTime(gn, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + dec)
    o.start(now); o.stop(now + dec)
  }
  const body = new OscillatorNode(ctx, { type: 'sine', frequency: 220 })
  const bg = new GainNode(ctx, { gain: 0 })
  body.connect(bg); bg.connect(bus)
  bg.gain.setValueAtTime(0.12, now)
  bg.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
  body.frequency.exponentialRampToValueAtTime(110, now + 0.03)
  body.start(now); body.stop(now + 0.05)
}

function synthCowbell(bus: GainNode, now: number, vel: number) {
  const o1 = new OscillatorNode(ctx, { type: 'square', frequency: 587 })
  const o2 = new OscillatorNode(ctx, { type: 'square', frequency: 845 })
  const g = new GainNode(ctx, { gain: 0 })
  const f = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: 700, Q: 3 })
  o1.connect(g); o2.connect(g); g.connect(f); f.connect(bus)
  g.gain.setValueAtTime(0.06 * vel, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
  o1.start(now); o2.start(now); o1.stop(now + 0.08); o2.stop(now + 0.08)
}

// ═══ BUILD BEAT FROM JSON ═════════════════════════════════════
function buildBeat(m: MoodCtx, def: any) {
  const bpm: number = def.bpm
  const bt = 60 / bpm, s16 = bt / 4, bar = bt * 4
  const L = def.layers || {}

  // ── PAD ──
  if (L.pad) {
    const c = L.pad
    const chords = c.chords.map((ch: Note[]) => ch.map(NN))
    const dur = c.chordDuration || (bar * 4 / chords.length)
    const { type = 'sawtooth', detune = 1.003, filterLow: fLo = 400, filterHigh: fHi = 700,
      filterQ: fQ = 1.5, gain: gn = 0.05, attack = 0.4 } = c
    let idx = 0
    function padPlay() {
      const chord = chords[idx % chords.length]
      const now = ctx.currentTime
      const g = new GainNode(ctx, { gain: 0 })
      const f = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: fLo, Q: fQ })
      g.connect(f); f.connect(m.bus)
      const os: OscillatorNode[] = []
      for (const freq of chord) {
        const o1 = new OscillatorNode(ctx, { type, frequency: freq })
        const o2 = new OscillatorNode(ctx, { type, frequency: freq * detune })
        o1.connect(g); o2.connect(g); os.push(o1, o2)
      }
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(gn, now + attack)
      g.gain.setValueAtTime(gn, now + dur - 0.5)
      g.gain.linearRampToValueAtTime(0, now + dur)
      f.frequency.setValueAtTime(fLo, now)
      f.frequency.linearRampToValueAtTime(fHi, now + dur * 0.6)
      f.frequency.linearRampToValueAtTime(fLo, now + dur)
      for (const o of os) { o.start(now); o.stop(now + dur) }
      idx++; m.after(dur * 1000, padPlay)
    }
    padPlay()
  }

  // ── SUB BASS ──
  if (L.sub) {
    const c = L.sub
    if (c.freq) {
      // Drone mode
      const osc = new OscillatorNode(ctx, { type: 'sine', frequency: NN(c.freq) })
      const g = new GainNode(ctx, { gain: c.gain || 0.17 })
      osc.connect(g); g.connect(m.bus); osc.start(); m.keep(osc)
      if (c.pulseSpeed) {
        const pDur = c.pulseSpeed * bar
        const baseGain = c.gain || 0.17
        function pulse() {
          const now = ctx.currentTime
          g.gain.setValueAtTime(baseGain * 0.7, now)
          g.gain.linearRampToValueAtTime(baseGain, now + pDur / 2)
          g.gain.linearRampToValueAtTime(baseGain * 0.7, now + pDur)
          m.after(pDur * 1000, pulse)
        }
        pulse()
      }
    } else if (c.notes) {
      // Chord-following mode
      const notes = c.notes.map((n: Note) => NN(n))
      const dur = c.noteDuration || (bar * 4 / notes.length)
      const gn = c.gain || 0.17
      let idx = 0
      function subPlay() {
        const freq = notes[idx % notes.length]
        const now = ctx.currentTime
        const o = new OscillatorNode(ctx, { type: 'sine', frequency: freq })
        const g = new GainNode(ctx, { gain: 0 })
        o.connect(g); g.connect(m.bus)
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(gn, now + 0.05)
        g.gain.setValueAtTime(gn, now + dur - 0.3)
        g.gain.exponentialRampToValueAtTime(0.001, now + dur)
        o.start(now); o.stop(now + dur)
        idx++; m.after(dur * 1000, subPlay)
      }
      subPlay()
    }
  }

  // ── KICK ──
  if (L.kick) {
    const c = L.kick
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    stepLoop(m, ms, c.pattern.length, s => {
      if (c.pattern[s]) synthKick(m.bus, ctx.currentTime,
        c.startFreq ?? 160, c.endFreq ?? 38, c.sweep ?? 0.08,
        c.gain ?? 0.30, c.decay ?? 0.35, c.click !== false)
    })
  }

  // ── SNARE ──
  if (L.snare) {
    const c = L.snare
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    stepLoop(m, ms, c.pattern.length, s => {
      if (c.pattern[s]) synthSnare(m.bus, ctx.currentTime, c.gain ?? 0.04, c.decay ?? 0.12)
    })
  }

  // ── HI-HAT (closed) ──
  if (L.hihat) {
    const c = L.hihat
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    const swAmt = (c.swing || 0) * s16
    stepLoop(m, ms, c.pattern.length, s => {
      const vel = c.pattern[s]
      if (vel > 0) {
        const delay = (swAmt && s % 2 === 1) ? swAmt : 0
        synthHat(m.bus, ctx.currentTime + delay, vel,
          c.decay ?? 0.04, c.freq1 ?? 6500, c.freq2 ?? 7350, c.hipass ?? 8000)
      }
    })
  }

  // ── OPEN HI-HAT ──
  if (L.openhat) {
    const c = L.openhat
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    stepLoop(m, ms, c.pattern.length, s => {
      const vel = c.pattern[s]
      if (vel > 0) synthHat(m.bus, ctx.currentTime, vel,
        c.decay ?? 0.12, c.freq1 ?? 6800, c.freq2 ?? 7400, c.hipass ?? 7500)
    })
  }

  // ── COWBELL ──
  if (L.cowbell) {
    const c = L.cowbell
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    stepLoop(m, ms, c.pattern.length, s => {
      if (c.pattern[s]) synthCowbell(m.bus, ctx.currentTime, c.pattern[s])
    })
  }

  // ── BASS ──
  if (L.bass) {
    const c = L.bass
    const notes = c.notes.map((n: Note | null) => N(n))
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    const decMul = c.decay ?? 0.9
    stepLoop(m, ms, notes.length, s => {
      const freq = notes[s]
      if (!freq) return
      const now = ctx.currentTime
      const dur = decMul * ms / 1000
      const o = new OscillatorNode(ctx, { type: c.type || 'sine', frequency: freq })
      const g = new GainNode(ctx, { gain: 0 })
      o.connect(g)
      if (c.filterFreq) {
        const fl = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: c.filterFreq, Q: c.filterQ ?? 3 })
        g.connect(fl); fl.connect(m.bus)
        if (c.filterEnv) {
          fl.frequency.setValueAtTime(c.filterFreq * 1.6, now)
          fl.frequency.exponentialRampToValueAtTime(c.filterFreq * 0.5, now + dur)
        }
      } else { g.connect(m.bus) }
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(c.gain ?? 0.17, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, now + dur)
      o.start(now); o.stop(now + dur + 0.01)
    })
  }

  // ── ARP ──
  if (L.arp) {
    const c = L.arp
    const notes = c.notes.map(NN)
    const ms = s16 * (16 / (c.resolution || 16)) * 1000
    const dec = (c.decayMul ?? 0.7) * ms / 1000
    stepLoop(m, ms, notes.length, s => {
      const now = ctx.currentTime
      const o = new OscillatorNode(ctx, { type: c.type || 'square', frequency: notes[s] })
      const g = new GainNode(ctx, { gain: 0 })
      const f = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: c.filterFreq || 2500, Q: 1 })
      o.connect(g); g.connect(f); f.connect(m.bus)
      g.gain.setValueAtTime(c.gain || 0.035, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + dec)
      o.start(now); o.stop(now + dec + 0.01)
    })
  }

  // ── TEXTURE ──
  if (L.texture) {
    const c = L.texture
    const tFreqs = c.freqs || [3050, 3150, 3270, 3380]
    const g = new GainNode(ctx, { gain: c.gain ?? 0.007 })
    const f = new BiquadFilterNode(ctx, { type: 'bandpass', frequency: c.filterCenter ?? 450, Q: c.filterQ ?? 0.3 })
    g.connect(f); f.connect(m.bus)
    for (const freq of tFreqs) {
      const o = new OscillatorNode(ctx, { type: 'sawtooth', frequency: freq })
      o.connect(g); o.start(); m.keep(o)
    }
    const fLo = c.filterLow ?? 300, fHi = c.filterHigh ?? 600
    const sweepDur = (c.sweepBars ?? 16) * bar
    function sweep() {
      const now = ctx.currentTime
      f.frequency.setValueAtTime(fLo, now)
      f.frequency.linearRampToValueAtTime(fHi, now + sweepDur / 2)
      f.frequency.linearRampToValueAtTime(fLo, now + sweepDur)
      m.after(sweepDur * 1000, sweep)
    }
    sweep()
  }

  // ── MELODY ──
  if (L.melody) {
    const c = L.melody
    const phrases = c.phrases.map((p: Note[]) => p.map(NN))
    const { noteGap = 1.0, phraseGapBars = 6, gain: gn = 0.04,
      attack = 0.3, decay: dec = 2.0, filterFreq = 900, type = 'triangle',
      startAfterBars = 4 } = c
    let pIdx = 0
    function melPhrase() {
      const phrase = phrases[pIdx % phrases.length]
      let nIdx = 0
      function melNote() {
        if (nIdx >= phrase.length) {
          pIdx++; m.after((phraseGapBars + pIdx % 3) * bar * 1000, melPhrase); return
        }
        const freq = phrase[nIdx]
        const now = ctx.currentTime
        const o1 = new OscillatorNode(ctx, { type: type as OscillatorType, frequency: freq })
        const o2 = new OscillatorNode(ctx, { type: 'sine', frequency: freq * 1.002 })
        const g = new GainNode(ctx, { gain: 0 })
        const f = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: filterFreq, Q: 0.7 })
        o1.connect(g); o2.connect(g); g.connect(f); f.connect(m.bus)
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(gn, now + attack)
        g.gain.setValueAtTime(gn, now + attack + 0.3)
        g.gain.exponentialRampToValueAtTime(0.001, now + dec)
        o1.start(now); o2.start(now); o1.stop(now + dec); o2.stop(now + dec)
        nIdx++; m.after(noteGap * 1000, melNote)
      }
      melNote()
    }
    m.after(startAfterBars * bar * 1000, melPhrase)
  }

  // ── STAB ──
  if (L.stab) {
    const c = L.stab
    const freqs = c.freqs.map(NN)
    const { type = 'sawtooth', gain: gn = 0.06, decay: dec = 1.5,
      filterFreq = 600, filterQ = 5, filterDecay = true, pump = false,
      intervalBars = 8, startAfterBars = 6, durationBeats } = c
    const dur = durationBeats ? durationBeats * bt : dec
    function stab() {
      const now = ctx.currentTime
      const g = new GainNode(ctx, { gain: 0 })
      const f = new BiquadFilterNode(ctx, { type: 'lowpass', frequency: filterFreq, Q: filterQ })
      g.connect(f); f.connect(m.bus)
      for (const freq of freqs) {
        const o = new OscillatorNode(ctx, { type: type as OscillatorType, frequency: freq })
        o.connect(g); o.start(now); o.stop(now + dur)
      }
      if (pump) {
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(gn, now + dur / 2)
        g.gain.linearRampToValueAtTime(0, now + dur)
        f.frequency.setValueAtTime(filterFreq * 0.6, now)
        f.frequency.linearRampToValueAtTime(filterFreq, now + dur / 2)
        f.frequency.linearRampToValueAtTime(filterFreq * 0.6, now + dur)
      } else {
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(gn, now + 0.05)
        g.gain.exponentialRampToValueAtTime(0.001, now + dur)
        if (filterDecay) {
          f.frequency.setValueAtTime(filterFreq, now)
          f.frequency.exponentialRampToValueAtTime(150, now + dur)
        }
      }
      m.after(intervalBars * bar * 1000, stab)
    }
    m.after(startAfterBars * bar * 1000, stab)
  }
}

// ═══ PRESETS ══════════════════════════════════════════════════
const presets: Record<string, any> = {
  'calm-focus': {
    name: 'Calm Focus', bpm: 92,
    layers: {
      pad: { chords: [['D3','F3','A3','C4','E4'],['G3','B3','D4','F4'],['C3','E3','G3','B3']],
        filterLow: 400, filterHigh: 700, gain: 0.05, attack: 0.4 },
      sub: { notes: ['D2','G2','C2'], gain: 0.17 },
      kick: { pattern: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        startFreq: 120, endFreq: 40, gain: 0.18, decay: 0.6, click: false },
      hihat: { pattern: [0,0,.7,0,0,.3,.8,0,0,0,.6,0,0,.35,.7,0], decay: 0.05, swing: 0.07 },
      melody: { phrases: [['D4','E4','G4'],['A4','G4','F4'],['E4','D4','C4'],['G4','A4','B4','A4']],
        noteGap: 0.98, phraseGapBars: 6, gain: 0.04, filterFreq: 1000 },
      texture: { filterLow: 400, filterHigh: 650, gain: 0.006 },
    }
  },
  'deep-focus': {
    name: 'Deep Focus / Flow', bpm: 105,
    layers: {
      pad: { chords: [['A3','C4','E4','G4'],['E3','G3','B3','D4'],['D3','F3','A3','C4']],
        filterLow: 300, filterHigh: 500, filterQ: 2, gain: 0.05, attack: 0.5 },
      sub: { notes: ['A1','E2','D2'], gain: 0.16 },
      kick: { pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        startFreq: 140, endFreq: 38, gain: 0.20, decay: 0.4 },
      hihat: { pattern: [.5,.2,.35,.2,.5,.2,.3,.2,.5,.2,.35,.2,.5,.2,.3,.2], decay: 0.035 },
      texture: { filterLow: 350, filterHigh: 550, gain: 0.008, sweepBars: 32 },
    }
  },
  'dark-atmospheric': {
    name: 'Dark Atmospheric', bpm: 98,
    layers: {
      pad: { chords: [['E3','G3','B3'],['E3','G3','B3'],['F3','A3','C4'],['E3','G3','B3']],
        chordDuration: 4.898, detune: 1.006, filterLow: 150, filterHigh: 280, filterQ: 3, gain: 0.055, attack: 0.8 },
      sub: { freq: 'E1', gain: 0.17, pulseSpeed: 6 },
      kick: { pattern: [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        resolution: 32, startFreq: 150, endFreq: 35, gain: 0.20, decay: 0.7, click: false },
      hihat: { pattern: [0,0,0,.5,0,0,0,0,0,0,.7,0,0,0,0,0,0,0,0,0,0,.4,0,0,0,0,0,0,0,.6,0,0],
        resolution: 32, decay: 0.04 },
      melody: { phrases: [['E4','F4','E4'],['D4','C4','B3'],['F4','E4','D4','C4'],['A3','G3']],
        noteGap: 1.22, phraseGapBars: 5, gain: 0.04, decay: 2.5, filterFreq: 700 },
      texture: { filterLow: 250, filterHigh: 450, gain: 0.008, freqs: [3050,3170,3280,3390,3460] },
      stab: { freqs: ['E3','F3'], gain: 0.06, decay: 1.5, filterFreq: 600, filterQ: 5,
        intervalBars: 8, startAfterBars: 6 },
    }
  },
  'energetic': {
    name: 'Energetic Motivation', bpm: 128,
    layers: {
      pad: { chords: [['G3','B3','D4'],['F3','A3','C4'],['C4','E4','G4'],['G3','B3','D4']],
        chordDuration: 1.875, filterLow: 600, filterHigh: 1200, gain: 0.05, attack: 0.15, detune: 1.004 },
      bass: { notes: ['G2',null,null,'G2',null,null,'C2',null,'E2',null,null,'E2',null,null,'C2',null],
        type: 'sawtooth', gain: 0.12, decay: 1.8, filterFreq: 500, filterQ: 4, filterEnv: true },
      kick: { pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], gain: 0.32, decay: 0.35 },
      snare: { pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0] },
      hihat: { pattern: [0,.2,1,.3,0,.2,1,0,0,.25,1,.3,0,.2,1,.4], decay: 0.04 },
      texture: { filterLow: 500, filterHigh: 900, gain: 0.005 },
    }
  },
  'lofi-chill': {
    name: 'Lo-fi Chill Study', bpm: 78,
    layers: {
      pad: { chords: [['C4','Eb4','G4','Bb4','D5'],['F3','Ab3','C4','Eb4','G4'],
        ['C4','Eb4','G4','Bb4','D5'],['G3','B3','D4','F4']],
        type: 'triangle', detune: 1.002, filterLow: 1000, filterHigh: 1400, filterQ: 0.8, gain: 0.065, attack: 0.08 },
      sub: { notes: ['C2','F2','C2','G2'], gain: 0.16 },
      kick: { pattern: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
        startFreq: 100, endFreq: 42, gain: 0.16, decay: 0.5, click: false },
      snare: { pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], gain: 0.03, decay: 0.10 },
      hihat: { pattern: [0,0,.6,0,0,.2,.5,0,0,0,.5,0,0,.25,.6,0],
        decay: 0.05, swing: 0.12, freq1: 6000, freq2: 6800, hipass: 7000 },
      melody: { phrases: [['C5','Bb4','G4'],['F4','Eb4','C4'],['Bb4','C5','Bb4','G4']],
        noteGap: 1.15, phraseGapBars: 6, gain: 0.05, filterFreq: 1000, type: 'triangle' },
      texture: { freqs: [8200,8600,9100,9500], filterCenter: 4000, filterQ: 0.2,
        gain: 0.003, filterLow: 3000, filterHigh: 5000, sweepBars: 8 },
    }
  },
  'brainstorm': {
    name: 'Brainstorm Mode', bpm: 180,
    layers: {
      kick: { pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
        startFreq: 170, endFreq: 40, gain: 0.30, decay: 0.25 },
      snare: { pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], decay: 0.10 },
      hihat: { pattern: [.9,.3,.6,.3,.9,.3,.5,.4,.9,.3,.6,.3,.9,.4,.5,.3], decay: 0.025 },
      openhat: { pattern: [0,0,.5,0,0,0,.5,0,0,0,.5,0,0,0,.5,0], decay: 0.12 },
      bass: { notes: ['G2',null,'G2',null,'A2',null,null,'G2','C3',null,'B2',null,'A2',null,'G2',null],
        type: 'sawtooth', gain: 0.11, decay: 1.5, filterFreq: 800, filterQ: 4, filterEnv: true },
      pad: { chords: [['G3','B3','D4'],['F3','A3','C4'],['C4','E4','G4'],['G3','B3','D4']],
        chordDuration: 1.333, filterLow: 800, filterHigh: 1400, gain: 0.04, attack: 0.15, detune: 1.004 },
      arp: { notes: ['G4','B4','D5','B4','F4','A4','C5','A4','C5','E5','G5','E5','G4','B4','D5','B4'],
        type: 'square', gain: 0.035, filterFreq: 2500 },
    }
  },
  'hard-phonk': {
    name: 'Hard Phonk', bpm: 140,
    layers: {
      kick: { pattern: [1,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0],
        startFreq: 180, endFreq: 30, gain: 0.40, decay: 0.35 },
      bass: { notes: ['D1',null,null,null,'D1',null,null,null,'E1',null,null,'D1','C1',null,null,null],
        gain: 0.28, decay: 3 },
      snare: { pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], gain: 0.05, decay: 0.15 },
      cowbell: { pattern: [0,1,0,.6,0,.8,0,0,0,1,0,.7,0,0,.5,0] },
      hihat: { pattern: [0,0,.8,0,0,0,.4,.5,.6,.7,.9,0,0,0,.3,.5,.7,.9,0,0,.8,0,0,0,.3,.4,.5,.7,.8,1,0,0],
        resolution: 32, decay: 0.03, freq1: 7200, freq2: 8100, hipass: 9000 },
      stab: { freqs: ['D3','Eb3'], type: 'sawtooth', gain: 0.06,
        durationBeats: 2, pump: true, filterFreq: 1200, filterQ: 8, intervalBars: 2, startAfterBars: 0 },
    }
  },
}

// ═══ CROSSFADE ENGINE ═════════════════════════════════════════
let currentMood: MoodCtx | null = null
let lastFileHash = ''

function crossfadeTo(label: string, def: any, fadeSec: number = DEFAULT_CROSSFADE) {
  const newMood = new MoodCtx(label)
  buildBeat(newMood, def)

  const now = ctx.currentTime
  newMood.bus.gain.setValueAtTime(0, now)
  newMood.bus.gain.linearRampToValueAtTime(1, now + fadeSec)

  if (currentMood) {
    const old = currentMood
    old.bus.gain.setValueAtTime(1, now)
    old.bus.gain.linearRampToValueAtTime(0, now + fadeSec)
    setTimeout(() => old.destroy(), (fadeSec + 1) * 1000)
    console.log(`\n  Morphing → ${label} (${fadeSec}s crossfade)`)
  } else {
    console.log(`\n  Starting: ${label}`)
  }

  const layers = Object.keys(def.layers || {}).join(', ')
  console.log(`  ${def.bpm} BPM | Layers: ${layers}`)
  if (def.name) console.log(`  "${def.name}"`)
  currentMood = newMood
}

// ═══ FILE WATCHER ═════════════════════════════════════════════
if (!existsSync(MOOD_FILE)) {
  writeFileSync(MOOD_FILE, JSON.stringify({ preset: 'calm-focus' }, null, 2))
}

function checkMood() {
  try {
    const raw = readFileSync(MOOD_FILE, 'utf-8').trim()
    if (raw === lastFileHash) return
    lastFileHash = raw
    const data = JSON.parse(raw)
    const fadeSec = data.crossfade ?? DEFAULT_CROSSFADE

    if (data.preset || data.mood) {
      const name = data.preset || data.mood
      const preset = presets[name]
      if (!preset) {
        console.log(`  Unknown preset: "${name}". Available: ${Object.keys(presets).join(', ')}`)
        return
      }
      crossfadeTo(name, preset, fadeSec)
    } else if (data.bpm && data.layers) {
      crossfadeTo(data.name || 'custom', data, fadeSec)
    }
  } catch (e: any) {
    console.log(`  Error reading mood.json: ${e.message}`)
  }
}

let debounce: ReturnType<typeof setTimeout> | null = null
watch(MOOD_FILE, { persistent: false }, () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(checkMood, 150)
})

// ═══ BOOT ═════════════════════════════════════════════════════
console.log('  Claude Beats Engine v2 — JSON-driven')
console.log('┌──────────────────────────────────────────────────┐')
console.log('│  Persistent engine with crossfade morphing        │')
console.log('│                                                   │')
console.log('│  Presets:                                         │')
for (const [id, p] of Object.entries(presets))
  console.log(`│    ${id.padEnd(22)} ${String(p.bpm).padStart(3)} BPM │`)
console.log('│                                                   │')
console.log('│  Usage:                                           │')
console.log('│    Preset:  {"preset": "calm-focus"}              │')
console.log('│    Custom:  {"bpm": 90, "layers": {...}}          │')
console.log('│    + optional "crossfade": 4 (seconds)            │')
console.log('│                                                   │')
console.log('│  Notes: use "C4", "Eb3", "F#5" or raw Hz (440)   │')
console.log('└──────────────────────────────────────────────────┘')
console.log('  Press Ctrl+C to stop\n')

checkMood()
setInterval(() => {}, 1000)
