# Plan: Refine `/interview` Command

## Goal
Transform `/interview` from generic Q&A into a structured ideation tool that helps users crystallize scattered thoughts into actionable plans.

## Implementation

### 1. Timer Integration
- Accept optional duration arg: `/interview 10m` (default: 5m)
- Start background timer via `sleep <seconds> && echo "Interview time check"` or `terminal-notifier` on macOS
- After timer fires, ask: "Time's up. Continue or wrap up?"

### 2. Question Strategy
- **No generic questions** like "what are your requirements?"
- **Derive questions from user's stated intent** — parse their opening statement, identify gaps/ambiguities
- **Pushback built-in:**
  - Gentle: "Have you considered X?"
  - Direct: "This seems flawed because Y"
- **Limit to 3-5 questions per round**, iterate

### 3. Output Format
- Save to `./claude/interviews/<topic>-<date>.md`
- Structure:
  ```
  # Interview: <Topic>
  ## Context
  ## Key Decisions
  ## Open Questions
  ## Next Steps (actionable)
  ```
- File serves dual purpose: prompt context + personal reference

### 4. Flow
```
User: /interview 10m
Claude: [starts timer] What's the idea you're working through?
User: <scattered thoughts>
Claude: [asks pointed questions, challenges weak spots]
... 2-3 rounds ...
[Timer fires]
Claude: Time check — continue or synthesize?
User: synthesize
Claude: [writes plan to ./claude/interviews/]
```

## Decisions
- Timer: macOS-only (`terminal-notifier` or `osascript`)
- Filename: auto-generated as `interview-<timestamp>.md`
- Cleanup: never — keep all interview files permanently
