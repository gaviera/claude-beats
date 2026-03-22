#!/bin/bash
# start-engine.sh — Starts the beat engine in background on SessionStart
# stdout is injected into Claude's context

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PIDFILE="/tmp/claude-beats.pid"

# Check if engine is already running
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  CURRENT_MOOD=$(jq -r '.preset // .mood // .name // "unknown"' "$PLUGIN_DIR/mood.json" 2>/dev/null)
  echo "🎵 Claude Beats engine running (PID $(cat "$PIDFILE")). Current mood: $CURRENT_MOOD"
  exit 0
fi

# Ensure dependencies are installed
if [ ! -d "$PLUGIN_DIR/node_modules" ] || [ ! -d "$PLUGIN_DIR/node_modules/node-web-audio-api" ]; then
  cd "$PLUGIN_DIR"
  if ! npm install --silent 2>/tmp/claude-beats-install.log; then
    echo "⚠️ Failed to install dependencies. Check /tmp/claude-beats-install.log"
    exit 0
  fi
fi

# Initialize mood.json if missing
if [ ! -f "$PLUGIN_DIR/mood.json" ]; then
  echo '{"preset": "deep-focus"}' > "$PLUGIN_DIR/mood.json"
fi

# Start engine in background
cd "$PLUGIN_DIR"
nohup npx tsx beat.ts > /tmp/claude-beats.log 2>&1 &
echo $! > "$PIDFILE"

# Wait briefly for engine to initialize
sleep 1

if kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "🎵 Claude Beats engine started. Music will automatically match your coding mood."
  echo "   Presets: calm-focus | deep-focus | dark-atmospheric | energetic | lofi-chill | brainstorm | hard-phonk"
  echo "   Use /beat:vibe [mood] to change manually, /beat:off to stop."
else
  echo "⚠️ Beat engine failed to start. Check /tmp/claude-beats.log"
fi

exit 0
