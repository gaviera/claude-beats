#!/bin/bash
# analyze-mood.sh — Async hook on Stop: analyzes conversation mood, updates beat
# Runs after every Claude response. Only changes beat if mood actually shifted.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MOOD_FILE="$PLUGIN_DIR/mood.json"
PIDFILE="/tmp/claude-beats.pid"

# Skip if engine isn't running
if [ ! -f "$PIDFILE" ] || ! kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  exit 0
fi

# Read hook input from stdin
INPUT=$(cat)
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

# Extract text from last 30 transcript entries
# Handles both string content and array content formats
RECENT=$(tail -30 "$TRANSCRIPT_PATH" | jq -r '
  if .content then
    if (.content | type) == "string" then .content
    elif (.content | type) == "array" then
      [.content[] | select(.type == "text" or .type == "tool_result") |
       .text // .content // empty] | join(" ")
    else empty
    end
  elif .text then .text
  else empty
  end
' 2>/dev/null | tr '\n' ' ' | tail -c 5000)

if [ -z "$RECENT" ]; then
  exit 0
fi

# ── Score each mood by keyword frequency ──

# Crisis: production down, critical bugs, everything broken
PHONK=$(echo "$RECENT" | grep -oiE 'everything.broke|disaster|critical|urgent|hotfix|production.down|sev.?1|incident|catastroph|nightmare' 2>/dev/null | wc -l | tr -d ' ')

# Debugging: errors, bugs, fixing things
DARK=$(echo "$RECENT" | grep -oiE 'error|bug|fix|debug|fail|broken|crash|exception|stack.trace|not.work|issue|problem|TypeError|ReferenceError|segfault|panic|undefined.is.not' 2>/dev/null | wc -l | tr -d ' ')

# Brainstorming: ideas, design, exploration
BRAIN=$(echo "$RECENT" | grep -oiE 'brainstorm|idea|design|explore|plan|architect|approach|strategy|consider|think.about|how.should|what.if|concept|prototype|sketch|draft' 2>/dev/null | wc -l | tr -d ' ')

# High energy: building, refactoring, grinding
ENERGY=$(echo "$RECENT" | grep -oiE 'refactor|performance|optimize|grind|todo|cleanup|migration|implement|build|create|add.feature|rewrite|restructur|overhaul' 2>/dev/null | wc -l | tr -d ' ')

# Chill: reading, reviewing, casual
CHILL=$(echo "$RECENT" | grep -oiE 'chill|relax|read|doc|review|simple|easy|casual|slow|gentle|browse|look.at|check.out|understand' 2>/dev/null | wc -l | tr -d ' ')

# Calm/success: things going well, shipping
CALM=$(echo "$RECENT" | grep -oiE 'done|success|works|pass|merged|shipped|deploy|complete|fixed|resolved|good|great|perfect|nice|clean|smooth|ready' 2>/dev/null | wc -l | tr -d ' ')

# ── Determine mood (minimum threshold of 3 matches to trigger change) ──
MOOD=""
MAX=2

for m in "hard-phonk:$PHONK" "dark-atmospheric:$DARK" "brainstorm:$BRAIN" "energetic:$ENERGY" "lofi-chill:$CHILL" "calm-focus:$CALM"; do
  NAME="${m%%:*}"
  SCORE="${m##*:}"
  if [ "$SCORE" -gt "$MAX" ]; then
    MAX="$SCORE"
    MOOD="$NAME"
  fi
done

# If no strong signal, keep current mood (don't default-change to deep-focus)
if [ -z "$MOOD" ]; then
  exit 0
fi

# ── Only update if mood actually changed ──
CURRENT=$(jq -r '.preset // .mood // "none"' "$MOOD_FILE" 2>/dev/null)

if [ "$MOOD" != "$CURRENT" ]; then
  # Use longer crossfade (10s) for automatic transitions — less jarring
  echo "{\"preset\": \"$MOOD\", \"crossfade\": 10}" > "$MOOD_FILE"
fi

exit 0
