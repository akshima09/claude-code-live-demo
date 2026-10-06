# Claude Demo Interface

Project-specific guidelines for this full-stack demo (Express 5 + React 19 + TypeScript). Merge with general behavioral guidelines as needed.

## Setup

```bash
npm install
npm run dev       # starts API (tsx watch) + Vite concurrently
npm run check     # tsc --noEmit + vite build + all tests
```

## 1. Architecture

**Each layer owns exactly one concern. Don't cross the lines.**

- `server/authService.ts` — all auth and rate-limiting decisions live here; keep route handlers thin.
- `server/app.ts` — Express route handlers only; no auth logic.
- `web/src/api.ts` — network calls and response parsing only; no UI state.
- React components — own UI state; delegate data fetching to `api.ts`.
- Reuse `SlidingWindowAttemptTracker`; do not create a second counter.
- API response shapes are stable; only change them when a task explicitly requires it.

## 2. Quality

**Every behavior change gets a test. Run the full check before you're done.**

- Use Vitest; add a regression test for every behavior change.
- Cover both backend behavior and user-visible frontend state.
- Rate-limiting tests must cover: success, threshold hit, 429, `Retry-After` value, and exact window expiry.
- Run `npm run check` before declaring completion.
- Before touching a failing test, explain its root cause with code evidence.

## 3. Boundaries

**Don't go beyond what was asked. Don't touch what you shouldn't.**

- Do not add dependencies without approval.
- Do not refactor code unrelated to the task.
- Do not read `.env` files or expose credentials.
- Do not push, deploy, or access production resources.
- Ask before any destructive command or change outside this repository.

## 4. Demo Conventions

**These are fixed contract values — do not change them without explicit instruction.**

- Demo account: `akshima` / `correct-horse-battery-staple`.
- Login failures return a single generic error — no user enumeration.
- A login is blocked after **5 failures** in a rolling **10-minute window**.
- 5th failure → `401`; 6th attempt within the window → `429`.
- A `429` response includes an integer `Retry-After` (seconds); the UI surfaces when retry is possible.
