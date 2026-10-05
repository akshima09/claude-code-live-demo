# Deck fact-check and terminology notes

Checked against current Anthropic documentation on 5 October 2026. UI availability still varies by
plan, organization policy, platform, and extension version, so verify the exact labels on the machine
used for the session.

## Say this on stage

- The deck's **Manual** mode is now commonly labeled **Ask permissions**.
- **Edit automatically** is commonly labeled **Auto accept edits**.
- Plan mode is for read-only exploration and a proposed approach before source edits.
- Bypass permissions is broader than “allow dangerous commands”: it automatically approves tool use
  that is not stopped by explicit deny/ask rules or hooks. Use it only in a deliberately isolated
  environment, not as a normal-development convenience.
- `CLAUDE.md` supplies persistent repository context; it is guidance, not an enforcement boundary.
- Project-scoped MCP configuration can be versioned in `.mcp.json`, and the user is asked to approve
  project servers. Every server still expands the capability and trust surface.
- Model lists and features vary by account and organization. Do not promise a specific model or mode
  unless you verified it in the session account.

## Deck weaknesses to fix verbally

- Slide numbering is inconsistent and the final slide duplicates number 21. This is cosmetic, but it
  can make spoken references confusing; refer to slide titles instead of numbers.
- “Native Claude Code UI running inside VS Code” can be misunderstood. Call it the Claude Code IDE
  integration/panel inside VS Code.
- The original FastAPI example demonstrates the backend workflow but gives the room little visual
  feedback. This repository preserves the same security requirement while making the contract span a
  React frontend and Express backend.
- “Run tests” is insufficient verification. State which behavior the tests establish and what they
  cannot establish, such as multi-node atomicity or production abuse resistance.

## Primary references

- Claude Code desktop and permission modes: <https://code.claude.com/docs/en/desktop>
- Claude Code CLI flags and permission mode: <https://docs.anthropic.com/en/docs/claude-code/cli-usage>
- Claude Code setup: <https://docs.anthropic.com/en/docs/claude-code/getting-started>
- MCP overview: <https://docs.anthropic.com/en/docs/mcp>
- MCP in Claude Code: <https://docs.anthropic.com/en/docs/claude-code/mcp>

