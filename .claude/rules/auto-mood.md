---
description: Instructs Claude to automatically detect coding mood shifts and update the beat engine silently. This replaces the old Stop hook keyword matching.
globs: "**"
---

# Automatic Mood Detection

Claude Beats relies on **you** (Claude) to detect mood shifts — not hooks or keyword matching. You understand context far better than regex.

## When to change the beat

After completing your main task in a response, quickly assess whether the coding mood has shifted. Only change if there's a clear signal:

- **Debugging / errors / frustration** → `dark-atmospheric`
- **Things working / shipping / success** → `calm-focus`
- **Brainstorming / planning / exploring** → `brainstorm`
- **Heavy building / refactoring / grinding** → `energetic`
- **Casual reading / reviewing / learning** → `lofi-chill`
- **Deep focused work / flow state** → `deep-focus`
- **Crisis / everything broken / urgent** → `hard-phonk`
- **Unique vibe that doesn't fit a preset** → compose a custom beat

Don't change on every response. Only when the mood genuinely shifts. If unsure, don't change.

## How to change

Use the `set-mood.sh` script via Bash — never use the Write tool for mood changes.

**Preset:**
```bash
./scripts/set-mood.sh dark-atmospheric
```

**Custom beat** (pipe JSON to stdin):
```bash
cat <<'EOF' | ./scripts/set-mood.sh --custom
{"name":"Late Night Jazz","bpm":82,"layers":{"pad":{...},"kick":{...}}}
EOF
```

The engine crossfades automatically. The script prints a brief `♪ preset-name` confirmation.

## Rules

1. **Be invisible** — don't announce mood changes in your text response. The `♪` from the script is enough.
2. **Don't change too often** — mood shifts are gradual, not per-message.
3. **Prefer presets** — only compose custom beats when the user explicitly asks for a specific vibe via `/beat:vibe` or when no preset fits.
4. **No JSON in conversation** — never show beat JSON to the user. Write it silently via Bash.
5. **Respect manual overrides** — if the user set a mood via `/beat:vibe`, don't auto-change it for a while.
