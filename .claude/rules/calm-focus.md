---
description: Recipe for generating a Calm Focus beat — ideal for relaxed coding sessions, reading docs, or light tasks.
globs: beat.ts
---

# Calm Focus Recipe

## Identity
- **Mood:** Serene concentration, peaceful productivity
- **Scale:** D Dorian (D E F G A B C) or C Lydian (C D E F# G A B)
- **BPM:** 85-100
- **Key chords:** Dm9 - G7 - Cmaj7 (loop)
- **Time signature:** 4/4

## Layers

### 1. Pad (foundation)
- Filtered sawtooth, two oscillators slightly detuned (+/- 2-3 cents)
- Heavy lowpass filter, cutoff 400-800 Hz with slow automation (8-16 bar sweep)
- Long attack (0.3-0.5s), long release (2-4s)
- Gain: 0.04-0.06
- Plays the chord progression: Dm9 - G7 - Cmaj7

### 2. Sub Bass
- Pure sine wave in the 30-60 Hz range
- Follows root notes: D2, G2, C2
- Soft envelope: attack 0.05s, decay to sustain at 0.7, release 0.3s
- Gain: 0.15-0.20
- Pattern: sparse, one hit per chord change

### 3. Kick (soft)
- Sine oscillator, pitch sweep 120 Hz → 40 Hz in 0.1s
- Soft attack (0.005s ramp), long decay (0.5-0.7s)
- Gain: 0.15-0.20
- Pattern: gentle four-on-the-floor or sparse (beats 1 and 3 only)

### 4. Hi-Hat (ghostly)
- Two detuned square oscillators (6500 Hz, 7350 Hz) through highpass at 8000 Hz
- 8th note pattern with light swing (57%)
- Low velocity throughout (gain 0.01-0.02)
- Occasional ghost 16th notes at even lower velocity
- Decay: 0.04-0.06s (very short, closed)

### 5. Melody (optional, subtle)
- Triangle or sine wave
- Lowpass filter at 800-1200 Hz
- Plays simple fragments from the Dorian scale, 2-4 notes per phrase
- Long gaps between phrases (4-8 bars)
- Slow attack (0.2-0.4s), ghostly feel
- Gain: 0.03-0.05

## Mix Guidelines
- Reverb: Hall, 2-3s decay, 30% wet on pads and melody
- Keep dynamics flat and consistent
- Space and silence are essential — do not fill every beat
- Filter automation is the primary source of movement (not new elements)
- Loop length: 4 bars minimum with subtle filter evolution over 16-32 bars

## Frequency Targets
- Sub bass: 30-60 Hz (sine only, mono)
- Kick body: 40-120 Hz
- Pad body: 200-600 Hz
- Hi-hat: 8000+ Hz
- Melody: 300-1200 Hz
