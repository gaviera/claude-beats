#!/bin/bash
# set-mood.sh — Clean interface to change the beat
# Usage:
#   ./scripts/set-mood.sh calm-focus              # preset
#   ./scripts/set-mood.sh calm-focus 12            # preset with crossfade
#   echo '{"bpm":120,"layers":{...}}' | ./scripts/set-mood.sh --custom   # custom beat from stdin
#   echo '{"bpm":120,"layers":{...}}' | ./scripts/set-mood.sh --custom 6 # custom + crossfade

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MOOD_FILE="$PLUGIN_DIR/mood.json"

PRESETS="calm-focus deep-focus dark-atmospheric energetic lofi-chill brainstorm hard-phonk"

if [ "$1" = "--custom" ]; then
  # Read custom beat JSON from stdin
  JSON=$(cat)
  CROSSFADE="${2:-10}"
  # Inject crossfade if not already present
  if echo "$JSON" | jq -e '.crossfade' > /dev/null 2>&1; then
    echo "$JSON" > "$MOOD_FILE"
  else
    echo "$JSON" | jq --argjson cf "$CROSSFADE" '. + {crossfade: $cf}' > "$MOOD_FILE"
  fi
  NAME=$(echo "$JSON" | jq -r '.name // "custom"' 2>/dev/null)
  BPM=$(echo "$JSON" | jq -r '.bpm // "?"' 2>/dev/null)
  echo "♪ $NAME ($BPM BPM)"
elif [ -n "$1" ]; then
  # Preset mode
  PRESET="$1"
  CROSSFADE="${2:-10}"
  # Validate preset name
  if ! echo "$PRESETS" | grep -qw "$PRESET"; then
    echo "Unknown preset: $PRESET"
    echo "Available: $PRESETS"
    exit 1
  fi
  echo "{\"preset\": \"$PRESET\", \"crossfade\": $CROSSFADE}" > "$MOOD_FILE"
  echo "♪ $PRESET"
else
  echo "Usage: set-mood.sh <preset> [crossfade_sec]"
  echo "       echo '{...}' | set-mood.sh --custom [crossfade_sec]"
  echo "Presets: $PRESETS"
  exit 1
fi
