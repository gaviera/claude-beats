---
description: General guide for generating beats in this project — when to use each genre, JSON schema for custom beats, and technical constraints. Always read this rule first when asked to create or modify a beat.
globs: beat.ts, mood.json
---

# Beat Generation Guide

## Architecture: Persistent JSON-driven Engine

The beat engine (`beat.ts`) runs **permanently in the background**. To change the beat, **write to `mood.json`** — the engine detects the change and crossfades automatically. NEVER kill and restart the process.

### Two modes: Preset or Custom

**Preset** — use a built-in mood by name:
```json
{"preset": "calm-focus"}
```

**Custom** — define a full beat via JSON (Claude can compose any beat on-demand):
```json
{"name": "My Beat", "bpm": 92, "crossfade": 6, "layers": {...}}
```

### Available presets
| Preset ID | BPM | When to Use |
|-----------|-----|-------------|
| `calm-focus` | 92 | "calm", "relax", "peaceful", "features going well" |
| `deep-focus` | 105 | "focus", "flow", "deep work", "concentrate", "zone" |
| `dark-atmospheric` | 98 | "dark", "debug", "things going wrong", "intense" |
| `energetic` | 128 | "energy", "motivation", "drive", "refactor", "grind" |
| `lofi-chill` | 78 | "lofi", "chill", "study", "cozy", "nostalgic" |
| `brainstorm` | 180 | "brainstorm", "fast", "ideas", "rapid", "happy" |
| `hard-phonk` | 140 | "phonk", "hard", "aggressive", "broken code" |

If the user's mood doesn't match a preset, **compose a custom beat** using the JSON schema below. If unclear, default to `deep-focus`.

## JSON Schema for Custom Beats

Notes can be **note names** (`"C4"`, `"Eb3"`, `"F#5"`) or **raw Hz** (`440`). Use note names for readability.

```json
{
  "name": "optional label",
  "bpm": 92,
  "crossfade": 8,
  "layers": {
    "pad": {
      "chords": [["D3","F3","A3","C4","E4"], ["G3","B3","D4"]],
      "chordDuration": 3.5,
      "type": "sawtooth",
      "detune": 1.003,
      "filterLow": 400,
      "filterHigh": 700,
      "filterQ": 1.5,
      "gain": 0.05,
      "attack": 0.4
    },
    "sub": {
      "notes": ["D2","G2","C2"],
      "noteDuration": 3.5,
      "gain": 0.17
    },
    "kick": {
      "pattern": [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      "resolution": 16,
      "startFreq": 120,
      "endFreq": 40,
      "sweep": 0.1,
      "gain": 0.18,
      "decay": 0.6,
      "click": false
    },
    "snare": {
      "pattern": [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      "gain": 0.04,
      "decay": 0.12
    },
    "hihat": {
      "pattern": [0,0,0.7,0,0,0.3,0.8,0,0,0,0.6,0,0,0.35,0.7,0],
      "resolution": 16,
      "decay": 0.05,
      "swing": 0.07,
      "freq1": 6500,
      "freq2": 7350,
      "hipass": 8000
    },
    "openhat": {
      "pattern": [0,0,0,0,0,0,0,0.5,0,0,0,0,0,0,0,0],
      "decay": 0.12
    },
    "cowbell": {
      "pattern": [0,1,0,0.6,0,0.8,0,0,0,1,0,0.7,0,0,0.5,0]
    },
    "bass": {
      "notes": ["D2",null,null,"D2",null,null,"C2",null],
      "type": "sawtooth",
      "gain": 0.12,
      "decay": 1.5,
      "filterFreq": 500,
      "filterQ": 4,
      "filterEnv": true
    },
    "arp": {
      "notes": ["G4","B4","D5","B4","F4","A4","C5","A4"],
      "type": "square",
      "gain": 0.035,
      "filterFreq": 2500,
      "decayMul": 0.7
    },
    "melody": {
      "phrases": [["D4","E4","G4"],["A4","G4","F4"]],
      "noteGap": 1.0,
      "phraseGapBars": 6,
      "gain": 0.04,
      "attack": 0.3,
      "decay": 2.0,
      "filterFreq": 900,
      "type": "triangle",
      "startAfterBars": 4
    },
    "texture": {
      "freqs": [3050,3150,3270,3380],
      "filterCenter": 450,
      "filterQ": 0.3,
      "gain": 0.007,
      "filterLow": 300,
      "filterHigh": 600,
      "sweepBars": 16
    },
    "stab": {
      "freqs": ["E3","F3"],
      "type": "sawtooth",
      "gain": 0.06,
      "decay": 1.5,
      "filterFreq": 600,
      "filterQ": 5,
      "filterDecay": true,
      "pump": false,
      "intervalBars": 8,
      "startAfterBars": 6,
      "durationBeats": 2
    }
  }
}
```

### Layer Reference

| Layer | Purpose | Pattern Type | Key Params |
|-------|---------|-------------|------------|
| `pad` | Chord progression, harmonic foundation | Timed chords | chords, chordDuration, type, filter, gain, attack |
| `sub` | Sub bass (chord-following or drone) | Notes or `freq` for drone | notes OR freq+pulseSpeed, gain |
| `kick` | Kick drum | 0/1 pattern | startFreq, endFreq, gain, decay, click |
| `snare` | Snare/clap | 0/1 pattern | gain, decay |
| `hihat` | Closed hi-hat | Velocity pattern (0-1) | decay, swing, freq1, freq2, hipass |
| `openhat` | Open hi-hat | Velocity pattern (0-1) | decay, freq1, freq2 |
| `cowbell` | Cowbell | Velocity pattern (0-1) | (uses built-in synth) |
| `bass` | Melodic bass line | Note/null pattern | type, gain, decay, filterFreq, filterEnv |
| `arp` | Arpeggiated notes | Note sequence | type, gain, filterFreq, decayMul |
| `melody` | Sparse melodic phrases | Phrase arrays | noteGap, phraseGapBars, gain, attack, decay |
| `texture` | Ambient noise wash | Continuous | freqs, filter, gain, sweepBars |
| `stab` | Periodic dissonant/accent hit | Timed interval | freqs, pump, intervalBars, durationBeats |

### Sub bass modes
- **Chord-following**: `{"notes": ["D2","G2","C2"], "gain": 0.17}` — plays each note for chordDuration
- **Drone**: `{"freq": "E1", "gain": 0.17, "pulseSpeed": 6}` — sustained single note with optional volume pulse

### Pattern resolution
- Default: 16 (16th notes per bar)
- Use `"resolution": 32` for 32nd note patterns (hi-hat rolls, etc.)
- Pattern length determines loop length: 16 items = 1 bar, 32 items = 2 bars (at res 16) or 1 bar (at res 32)

### Crossfade
- Default: 8 seconds
- Override per-change: `"crossfade": 4` in the JSON
- Both beats play simultaneously during crossfade (old fades out, new fades in)

## Composition Guidelines

### When composing custom beats, follow music theory:
- **Calm moods**: Dorian/Lydian modes, 75-100 BPM, slow attack pads, sparse kicks
- **Focus moods**: Aeolian/Dorian, 90-120 BPM, steady rhythm, minimal melody
- **Dark moods**: Phrygian/Harmonic Minor, 90-110 BPM, heavy filtering, dissonant stabs
- **Energetic moods**: Mixolydian/Major, 120-140 BPM, four-on-floor kick, bright filters
- **Chill moods**: Minor Pentatonic, 70-90 BPM, heavy swing, extended jazz chords
- **Fast moods**: Mixolydian, 160-180 BPM, arps, driving bass, bright pads

### Gain ranges (to prevent clipping):
- Kick: 0.15-0.40 (loudest element in energetic, softer in ambient)
- Sub/Bass: 0.10-0.28
- Pad: 0.03-0.07
- Hi-hat: pattern values 0.2-1.0 (scaled by 0.025 internally)
- Melody: 0.03-0.05
- Texture: 0.003-0.010
- Stab: 0.04-0.08

### Scale intervals (semitones from root)
| Scale | Intervals |
|-------|-----------|
| Dorian | 0 2 3 5 7 9 10 |
| Phrygian | 0 1 3 5 7 8 10 |
| Lydian | 0 2 4 6 7 9 11 |
| Mixolydian | 0 2 4 5 7 9 10 |
| Aeolian (Minor) | 0 2 3 5 7 8 10 |
| Harmonic Minor | 0 2 3 5 7 8 11 |
| Minor Pentatonic | 0 3 5 7 10 |

## Important Constraints
1. **Never edit beat.ts** to change beats — write to `mood.json` instead
2. **Never kill the engine** — it runs persistently, use crossfade
3. Notes use standard notation: C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B + octave (0-8)
4. `exponentialRampToValueAtTime` cannot target 0 — engine uses 0.001 internally
5. All layers are optional. Minimum viable beat = just `kick` + `hihat`
6. Engine runs with `npx tsx beat.ts`
