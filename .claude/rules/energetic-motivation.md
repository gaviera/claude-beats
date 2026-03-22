---
description: Recipe for generating an Energetic Motivation beat — ideal for repetitive tasks, debugging marathons, refactoring, or when energy is low.
globs: beat.ts
---

# Energetic Motivation Recipe

## Identity
- **Mood:** Driving energy, forward momentum, motivation
- **Scale:** G Mixolydian (G A B C D E F) or D Major (D E F# G A B C#)
- **BPM:** 120-135
- **Key chords:** G - F - C - G (Mixolydian vamp) or driving single-chord groove
- **Time signature:** 4/4

## Layers

### 1. Pad (bright, driving)
- Two sawtooth oscillators detuned +/- 4 cents (supersaw-lite)
- Lowpass filter cutoff 600-1200 Hz, Q: 1-2
- Filter automation synced to 4-bar phrases (opens up on bar 3-4)
- Medium attack (0.1-0.2s), medium release (1-2s)
- Gain: 0.05-0.07
- Chord changes every 2 bars for momentum

### 2. Bass (driving, present)
- Sawtooth through lowpass filter at 300-500 Hz, Q: 3-5
- Root notes follow chord progression: G2, F2, C2
- Quick attack (0.02s), moderate decay, short release
- 8th note pattern or syncopated rhythm for drive
- Filter envelope: opens on attack (500 Hz → 250 Hz over note duration)
- Gain: 0.10-0.14

### 3. Kick (four-on-the-floor, punchy)
- Sine oscillator, pitch sweep 160 Hz → 38 Hz in 0.08s
- Hard attack (0.002s), moderate decay (0.35s)
- Gain: 0.30-0.35 (dominant in the mix)
- Pattern: strict four-on-the-floor, every beat
- Click transient: square at 2000 Hz, gain 0.10, duration 0.01s

### 4. Snare / Clap (beats 2 and 4)
- Noise body: 5-6 detuned square oscillators (2200-6000 Hz) through bandpass at 3500 Hz
- Tonal snap: sine at 200 Hz, pitch drop to 120 Hz in 0.04s
- Short decay (0.12-0.15s)
- Gain: noise 0.04 each, snap 0.12
- Pattern: beats 2 and 4 (positions 4 and 12 in 16-step)

### 5. Hi-Hat (driving, offbeat)
- Two detuned squares (6500 Hz, 7350 Hz) through highpass at 8000 Hz
- Offbeat 8th notes (classic house pattern) with subtle swing (54-57%)
- Velocity: accented offbeats (0.8), softer downbeats (0.3)
- Decay: 0.04s closed, with occasional open hat (0.2s) every 4 bars
- Gain: 0.025-0.035

### 6. Lead / Arp (optional, energy boost)
- Square or sawtooth wave
- Lowpass filter at 1500-2500 Hz
- 16th note arpeggiated pattern through chord tones
- Short notes (staccato), gain 0.04-0.06
- Plays every other 4-bar section (4 bars on, 4 bars off) for dynamics

## Mix Guidelines
- Reverb: Room or plate, short decay (0.5-1.5s), 15-20% wet
- Kick should be the loudest element — drives the energy
- Brighter overall mix — filter cutoffs higher than other recipes
- Consistent dynamics but with natural 4-bar phrase structures
- Sidechain-like effect: slightly duck pad/bass on kick hits (reduce gain briefly)
- Movement through filter automation and arrangement (adding/removing elements)

## Frequency Targets
- Sub bass: 40-80 Hz (from kick)
- Bass: 80-300 Hz (sawtooth filtered)
- Kick body: 38-160 Hz
- Pad body: 300-1200 Hz
- Snare: 200-6000 Hz
- Hi-hat: 8000+ Hz
- Lead/Arp: 500-2500 Hz

## Key Principle
Forward momentum. The Mixolydian b7 (F natural against G root) avoids strong resolution — the progression always feels like it wants to keep going. Four-on-the-floor kick is non-negotiable. Energy comes from rhythm density and brighter filtering, not volume.
