# Claude Code full-stack live demo

A small React + Express member portal designed for one coherent live demonstration:

1. Explore a real request across the frontend and backend.
2. Plan a scoped security change without editing.
3. Implement login rate limiting and a visible blocked state.
4. Run tests, diagnose an exact-window bug, and fix it with evidence.
5. Review the final diff and discuss what still is not production-ready.

This is deliberately a **teaching repository**, not a production authentication system. The visual
result gives the audience something concrete to see while the backend work demonstrates repository
reasoning, tests, permissions, and security review.

## Quick start

Prerequisites: Node.js 20+, npm, Git, and Claude Code authenticated in VS Code.

```bash
npm install
npm run check
npm run dev
```

Open <http://localhost:5173>. The local API runs on <http://localhost:3001>.

Demo credentials:

```text
belona / correct-horse-battery-staple
```

## Prepared stages

| Stage | Git reference | Expected state |
|---|---|---|
| Start | `demo-start` or `main` | Portal works; login has no brute-force protection; checks pass |
| Debug | `demo-debug` | Full-stack rate limit is present; exact-window test fails |
| Solution | `demo-solution` | Complete implementation; all checks pass |

Use the guarded helper so you do not accidentally discard live-demo work:

```bash
./scripts/demo-stage start
./scripts/demo-stage debug
./scripts/demo-stage solution
```

The helper refuses to switch stages when the working tree is dirty.

## Repository map

```text
server/                 Express API, authentication, shared attempt tracker
web/src/                React member portal and API client
tests/server/           API and domain tests
tests/web/              UI behavior tests
.claude/settings.json   least-privilege project permission example
CLAUDE.md               stable repository instructions
docs/PROMPTS.md         copy/paste prompts for every demonstration stage
docs/PRESENTER_RUNBOOK.md timing, narration, recovery, and Q&A
docs/FACT_CHECK.md      terminology corrections and claims to qualify
docs/MCP_OPTION.md      optional local MCP extension, separate from the core demo
```

## The task shown live

> Add brute-force protection to member login. After five failed attempts for the same normalized
> username within ten minutes, return HTTP 429 with `Retry-After`. Preserve the existing success and
> 401 response bodies. In the React UI, explain the temporary block and disable sign-in until retry
> is possible. Reuse the existing tracker, avoid unrelated refactors, add backend and UI regression
> tests, run all checks, and review the final diff.

That prompt is intentionally saved for the implementation stage. Start with the smaller explore and
plan prompts in [docs/PROMPTS.md](docs/PROMPTS.md) to demonstrate disciplined use of an agent.

## Why this example is stronger than a backend-only demo

- The audience sees a visible before/after result.
- Claude must trace a contract across React, HTTP, Express, and domain logic.
- The change has meaningful security and UX tradeoffs.
- Tests expose a real boundary defect instead of a staged syntax error.
- The review can challenge the implementation: an in-memory, username-only limiter is not enough
  for a multi-instance production system.

