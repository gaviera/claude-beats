---
description: Recipe for generating a Dark Atmospheric beat — ideal for late night coding, debugging, or intense focused sessions.
globs: beat.ts
---

# Dark Atmospheric Recipe

## Identity
- **Mood:** Ominous focus, nocturnal intensity, deep immersion
- **Scale:** E Phrygian (E F G A B C D) or A Harmonic Minor (A B C D E F G#)
- **BPM:** 90-110
- **Key chords:** Em - F - Em (Phrygian oscillation) or Am - Dm - E7 - Am
- **Time signature:** 4/4

## Layers

### 1. Drone Pad (dark foundation)
- Two sawtooth oscillators heavily detuned (+/- 5-8 cents) for thick, dark texture
- Heavy lowpass filter, cutoff 150-300 Hz, Q: 2-4
- Very slow filter modulation over 8-16 bars (breathing effect)
- Extremely long attack (0.5-1.0s), infinite sustain feel, long release (4-6s)
- Gain: 0.04-0.07
- Stay on one chord for extended periods (2-4 bars minimum per chord)

### 2. Sub Bass (drone-like)
- Pure sine wave at root note, very low: E1 (41.2 Hz) or A1 (55 Hz)
- Sustained with slow volume modulation (pulsing feel)
- Gain: 0.15-0.20
- Pattern: extremely sparse, holds for multiple bars

### 3. Kick (sparse, deep)
- Sine oscillator, pitch sweep 150 Hz → 35 Hz in 0.12s
- Soft attack (0.005s), long decay (0.6-0.8s)
- Gain: 0.18-0.22
- Pattern: sparse — NOT four-on-the-floor. Use patterns like:
  - x . . . | . . x . | x . . . | . . . .
  - Or even sparser: one kick every 2 bars
- Space between kicks is essential

### 4. Hi-Hat (ghost, minimal)
- Two detuned squares (6500 Hz, 7234 Hz) through highpass at 7000 Hz
- Extremely sparse pattern, 3-4 hits per 2 bars maximum
- Very low velocity (gain 0.005-0.015)
- Variable decay: mostly closed (0.04s), occasional open (0.15s)
- No regular pattern — irregular placement adds tension

### 5. Eerie Melody (haunting fragments)
- Sine + triangle oscillators slightly detuned (1.002 ratio)
- Lowpass filter at 600-800 Hz, Q: 0.7
- Slow attack (0.3-0.5s), long release (2-3s) — ghostly
- Phrases: 3-4 notes from Phrygian scale, descending
- Long gaps between phrases (every 4-8 bars)
- Gain: 0.03-0.05
- Notes should feel like they emerge from and dissolve into the darkness

### 6. Texture (dark noise wash)
- 4-6 detuned sawtooth oscillators in the 3000-3500 Hz range
- Through bandpass filter centered at 300-500 Hz, Q: 0.3
- Very low gain (0.006-0.01)
- Slow filter sweep for organic movement
- Continuous background — the "air" of the space

## Mix Guidelines
- Reverb: Cathedral/large hall, 4-6s decay, 40-60% wet
- Heavy lowpass filtering on everything — nothing should sound bright
- Space and silence are compositional elements with equal weight to notes
- Extremely sparse arrangements — less is more
- Filter cutoff should rarely exceed 800 Hz on any element
- Movement comes from filter automation and slow volume modulation

## Frequency Targets
- Sub bass: 35-55 Hz (sine, mono)
- Kick body: 35-150 Hz
- Drone pad: 100-300 Hz (heavily filtered)
- Texture: 250-500 Hz (bandpass)
- Hi-hat: 7000+ Hz (very quiet)
- Melody: 250-800 Hz

## Key Principle
Darkness through subtraction. Remove frequencies, remove notes, remove beats. What remains should feel heavy and inevitable. The Phrygian b2 (F against E root) is the source of tension — use it deliberately and sparingly.
