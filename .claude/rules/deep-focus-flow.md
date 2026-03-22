---
description: Recipe for generating a Deep Focus / Flow State beat — ideal for deep work, complex problem solving, and long coding sessions.
globs: beat.ts
---

# Deep Focus / Flow State Recipe

## Identity
- **Mood:** Immersive concentration, tunnel vision, flow state
- **Scale:** A Aeolian (A B C D E F G) or A Dorian (A B C D E F# G)
- **BPM:** 95-115
- **Key chords:** Am7 - Em7 - Dm7 (descending 7th chords)
- **Time signature:** 4/4

## Layers

### 1. Pad (warm blanket)
- Two sawtooth oscillators detuned +/- 3 cents
- Lowpass filter cutoff 300-500 Hz, Q: 1-2
- Very slow filter automation over 16-32 bars (300 → 600 → 300 Hz)
- Long attack (0.4-0.6s), long sustain, long release (3-5s)
- Gain: 0.04-0.06
- Chord voicings: keep common tones between chords (smooth voice leading)

### 2. Sub Bass
- Pure sine wave
- Root notes: A1 (55 Hz), E2 (82.41 Hz), D2 (73.42 Hz)
- Gentle envelope: attack 0.08s, sustain 0.8, release 0.5s
- Gain: 0.15-0.18
- Pattern: one note per chord, sustained, minimal movement

### 3. Kick (present but not dominant)
- Sine oscillator, pitch sweep 140 Hz → 38 Hz in 0.09s
- Quick attack (0.003s), moderate decay (0.4s)
- Gain: 0.18-0.22
- Pattern: four-on-the-floor, steady and predictable
- Add subtle click transient (square at 1500 Hz, 0.01s duration, gain 0.06)

### 4. Hi-Hat (mechanical, straight)
- Two detuned square oscillators (6800 Hz, 7500 Hz) through highpass at 8500 Hz
- 16th note pattern, straight timing (50-52% swing)
- Very soft velocity (gain 0.008-0.015)
- Consistent — no accents, no variation, hypnotic
- Decay: 0.03-0.04s

### 5. Texture Layer (noise wash)
- Multiple detuned sawtooth oscillators (3000-3500 Hz range) through bandpass
- Bandpass center 400-600 Hz, Q: 0.3-0.5
- Very low gain (0.005-0.01)
- Continuous, acts as subtle filler
- Slow filter sweep adds almost imperceptible movement

## Mix Guidelines
- Reverb: Plate, 1.5-2s decay, 25% wet
- Repetition is king — 4-bar loops with filter automation the only variation
- No sudden changes in dynamics or instrumentation
- The beat should become invisible after 10-15 minutes (neural habituation)
- Straight timing preferred — predictability reduces cognitive load
- Minimal melodic content — melody competes with code reading

## Frequency Targets
- Sub bass: 55-85 Hz (sine, mono)
- Kick body: 38-140 Hz
- Pad body: 150-500 Hz
- Texture: 300-700 Hz (bandpass filtered)
- Hi-hat: 8500+ Hz

## Key Principle
This beat should be so repetitive and consistent that the brain stops noticing it after 10 minutes. Movement comes only from slow filter sweeps. No surprises.
