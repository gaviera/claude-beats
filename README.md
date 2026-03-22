# Claude Beats

Adaptive music engine for Claude Code. Generates beats that match your coding mood in real-time using pure oscillator synthesis.

The engine runs in the background while you code. It analyzes the conversation transcript after each Claude response and automatically crossfades to a new beat when your mood shifts — debugging triggers dark atmospheric, shipping features triggers calm focus, brainstorming triggers high-energy DnB.

## Install

```bash
# Add the marketplace
/plugin marketplace add gaviera/claude-beats

# Install the plugin
/plugin install claude-beats@claude-beats
```

Then install dependencies inside the plugin directory:

```bash
cd ~/.claude/plugins/claude-beats  # or wherever the plugin is installed
npm install
```

### Local development

To test without installing:

```bash
claude --plugin-dir /path/to/claude-beats
```

## How it works

```
SessionStart → starts beat engine in background
     ↓
You code, Claude responds
     ↓
Stop hook (async) → analyzes last 30 transcript lines for mood keywords
     ↓
Mood changed? → writes to mood.json → engine crossfades (10s)
     ↓
SessionEnd → stops engine
```

The engine (`beat.ts`) runs a persistent `AudioContext` via `node-web-audio-api`. Beats are defined as JSON — layers of oscillators, filters, and envelopes. When `mood.json` changes, the engine spins up the new beat at gain 0 and crossfades over 8-10 seconds while the old beat fades out. Audio never cuts.

## Presets

| Preset | BPM | Scale | Triggers on |
|--------|-----|-------|-------------|
| `calm-focus` | 92 | D Dorian | success, features working, shipping |
| `deep-focus` | 105 | A Aeolian | default, general coding |
| `dark-atmospheric` | 98 | E Phrygian | errors, bugs, debugging |
| `energetic` | 128 | G Mixolydian | refactoring, building, grinding |
| `lofi-chill` | 78 | C Minor Pentatonic | reading docs, reviewing, casual |
| `brainstorm` | 180 | G Mixolydian | ideation, design, exploration |
| `hard-phonk` | 140 | E Phrygian | critical incidents, everything broken |

## Slash commands

```
/beat:on          Start the engine manually
/beat:off         Stop the engine
/beat:vibe lofi   Switch to a preset
/beat:vibe something jazzy and dark   Claude composes a custom beat
```

## Custom beats

Write any beat definition to `mood.json` and the engine plays it. Notes use standard notation (`C4`, `Eb3`, `F#5`) or raw Hz.

```json
{
  "name": "Late Night Jazz",
  "bpm": 85,
  "crossfade": 6,
  "layers": {
    "pad": {
      "chords": [["Dm3","F3","A3","C4"], ["Gm3","Bb3","D4"]],
      "type": "sawtooth",
      "filterLow": 350,
      "filterHigh": 600,
      "gain": 0.05
    },
    "kick": {
      "pattern": [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
      "gain": 0.18,
      "click": false
    },
    "hihat": {
      "pattern": [0,0,0.6,0,0,0.3,0.7,0,0,0.2,0.5,0,0,0.3,0.6,0],
      "swing": 0.10,
      "decay": 0.05
    },
    "sub": { "notes": ["D2","G2"], "gain": 0.17 },
    "texture": { "gain": 0.005 }
  }
}
```

Available layers: `pad`, `sub`, `kick`, `snare`, `hihat`, `openhat`, `cowbell`, `bass`, `arp`, `melody`, `texture`, `stab`.

## Manual usage (without plugin)

```bash
# Install deps
npm install

# Start engine
npx tsx beat.ts

# Change beat (in another terminal)
echo '{"preset": "dark-atmospheric"}' > mood.json
```

## How the mood detection works

The `analyze-mood.sh` hook runs asynchronously after each Claude response. It reads the last 30 lines of the conversation transcript and counts keyword matches:

- **dark-atmospheric**: error, bug, fix, debug, fail, crash, exception
- **brainstorm**: idea, design, explore, plan, architect, strategy
- **energetic**: refactor, optimize, build, implement, migration
- **calm-focus**: done, success, works, merged, shipped, deployed
- **lofi-chill**: chill, relax, review, docs, simple
- **hard-phonk**: disaster, critical, urgent, production down

Minimum 3 matches required to trigger a change. If no strong signal, the current mood stays.

## Requirements

- Node.js 18+
- macOS (audio output via `node-web-audio-api`)
- Speakers or headphones
- Claude Code CLI

## Architecture

```
mood.json ←── analyze-mood.sh (hook)
    │
    ↓
beat.ts (persistent engine)
    │
    ├── MoodCtx (bus + layers + timers)
    ├── Crossfade system (old ↓ new ↑ over N seconds)
    ├── Layer builders (pad, kick, bass, hihat, melody, etc.)
    ├── Synth primitives (oscillators + filters + envelopes)
    └── File watcher on mood.json
```

Everything is synthesized from scratch — sine, sawtooth, square, and triangle oscillators through lowpass/highpass/bandpass filters. No samples, no external audio files.
