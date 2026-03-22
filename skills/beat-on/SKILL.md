---
name: beat-on
description: Start the Claude Beats engine manually. Use when the user wants to turn on background music.
allowed-tools: Bash
---

Start the Claude Beats engine:

1. Run `./scripts/start-engine.sh` from the claude-beats plugin directory
2. Report the status to the user (running, PID, current mood)
3. If the engine was already running, just report the current status
