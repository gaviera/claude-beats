#!/bin/bash
# stop-engine.sh — Stops the beat engine on SessionEnd

PIDFILE="/tmp/claude-beats.pid"

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null
    # Wait briefly for graceful shutdown
    sleep 0.5
    # Force kill if still running
    kill -0 "$PID" 2>/dev/null && kill -9 "$PID" 2>/dev/null
  fi
  rm -f "$PIDFILE"
fi

exit 0
