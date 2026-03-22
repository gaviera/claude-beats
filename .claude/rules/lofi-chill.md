---
description: Recipe for generating a Lo-fi Chill Study beat — ideal for casual coding, studying, writing, or winding down.
globs: beat.ts
---

# Lo-fi Chill Study Recipe

## Identity
- **Mood:** Nostalgic warmth, relaxed study vibe, cozy
- **Scale:** C Minor Pentatonic (C Eb F G Bb) or D Dorian (D E F G A B C)
- **BPM:** 75-85
- **Key chords:** Cmin9 - Fmin9 - Cmin9 - G7#5
- **Time signature:** 4/4

## Layers

### 1. Keys / Chord Pad (Rhodes-like warmth)
- Triangle wave for warm, mellow tone (closest to electric piano)
- Two oscillators slightly detuned (+/- 1-2 cents) for chorus effect
- Lowpass filter at 1000-1500 Hz, Q: 0.5-1
- Medium attack (0.05-0.1s), medium-long release (1.5-2.5s)
- Gain: 0.06-0.08
- Extended chords are essential: always use 7ths minimum, add 9ths and 11ths
- Voice leading: keep common tones, move voices by step

### 2. Sub Bass (warm, round)
- Pure sine wave
- Root notes: C2 (65.41 Hz), F2 (87.31 Hz), G2 (98 Hz)
- Soft envelope: attack 0.06s, sustain 0.7, release 0.4s
- Gain: 0.14-0.18
- Pattern: one note per chord, occasional octave jump for variation
- Slight volume swell on each note (gain ramp 0 → target over 0.06s)

### 3. Kick (dusty, soft)
- Sine oscillator, pitch sweep 100 Hz → 42 Hz in 0.1s (lower start = softer)
- Soft attack (0.008s ramp), medium decay (0.4-0.5s)
- Gain: 0.15-0.18 (not dominant)
- Pattern: boom-bap inspired, NOT four-on-the-floor
  - x . . . | . . . . | . . x . | . . . .
  - Or: x . . . | . . x . | . . . x | . . . .
- Slightly behind the grid (late by 5-10ms) for lazy feel

### 4. Snare (lo-fi, thin)
- Noise body: 3-4 detuned squares (3000-5500 Hz) through bandpass at 3000 Hz, Q: 1
- Minimal tonal body — mostly noise character
- Short decay (0.10-0.12s)
- Gain: 0.03 per oscillator
- Pattern: typically beats 2 and 4, but can syncopate
  - . . . . | x . . . | . . . . | x . . .
- Add slight swing delay (behind the grid)

### 5. Hi-Hat (swung, dusty)
- Two detuned squares (6000 Hz, 6800 Hz) through highpass at 7000 Hz
- 8th note base pattern with heavy swing (62-65%)
- Low velocity throughout (gain 0.008-0.015)
- Ghost 16th notes at even lower velocity (gain 0.003-0.006)
- Occasional open hat (decay 0.12s) for accent
- The swing is the soul of this beat — it MUST feel laid-back

### 6. Texture / Atmosphere (vinyl crackle substitute)
- Very high frequency detuned oscillators (8000-10000 Hz range, 4-5 of them)
- Through bandpass filter at 3000-5000 Hz, Q: 0.2 (wide)
- Extremely low gain (0.002-0.004) — barely perceptible
- Continuous, acts as vinyl crackle / tape hiss substitute
- Adds the lo-fi character and "imperfection"

### 7. Melody (optional, nostalgic)
- Triangle wave, lowpass at 1000 Hz
- Pentatonic scale fragments — simple, singable
- Swing timing matching the drums
- Short phrases (3-5 notes), long rests between phrases (4-8 bars)
- Gain: 0.04-0.06
- Should sound like a distant memory

## Mix Guidelines
- Reverb: Room on drums (0.5s), plate on keys/melody (1.5-2s), moderate wet (25-35%)
- Heavy swing on everything — every element should feel lazy and behind the beat
- Lowpass everything subtly — nothing should sound crisp or modern
- Dynamics: compressed, no sudden changes
- The "imperfection" is the aesthetic — slight detuning, uneven velocity, behind-the-grid timing
- 2-4 chord loop maximum — simplicity is the goal

## Frequency Targets
- Sub bass: 42-100 Hz (sine, mono)
- Kick body: 42-100 Hz
- Keys/Pad: 200-1500 Hz
- Snare: 2000-5500 Hz (thin, no low body)
- Hi-hat: 7000+ Hz
- Texture: 3000-5000 Hz (very quiet)
- Melody: 400-1000 Hz

## Key Principle
Imperfection is beauty. The swing, the dust, the warmth — lo-fi is about removing the digital perfection. Extended jazz chords (9ths, 11ths) create the nostalgic warmth. The beat should feel like it's playing from a worn cassette tape in a rainy afternoon.
