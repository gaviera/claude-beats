---
name: beat-vibe
description: Change the current beat mood. Use when the user wants to manually set the music mood. Accepts a mood name or description as argument.
allowed-tools: Bash, Read
---

Change the beat mood. The argument can be:

**A preset name:**
- calm-focus (92 BPM) — relaxed coding, features going well
- deep-focus (105 BPM) — flow state, deep work
- dark-atmospheric (98 BPM) — debugging, things going wrong
- energetic (128 BPM) — refactoring, grinding, motivation
- lofi-chill (78 BPM) — casual coding, studying
- brainstorm (180 BPM) — rapid ideation, exploration
- hard-phonk (140 BPM) — crisis mode, aggressive energy

**A mood description:** If the user describes a vibe instead of naming a preset (e.g., "something jazzy and dark"), compose a custom beat definition using the JSON schema from the beat-generation-guide rule.

Steps:
1. Parse the argument: $ARGUMENTS
2. If it matches a preset name, run: `./scripts/set-mood.sh <preset-name>`
3. If it's a description, compose a custom beat JSON following the rules in `.claude/rules/beat-generation-guide.md` and pipe it to set-mood.sh:
   ```bash
   cat <<'EOF' | ./scripts/set-mood.sh --custom
   {"name":"...","bpm":...,"layers":{...}}
   EOF
   ```
4. The engine detects the change and crossfades automatically
5. Confirm the change to the user with a brief message
