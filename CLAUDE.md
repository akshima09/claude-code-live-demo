# Project instructions

## Architecture

- Keep Express route handlers thin; authentication decisions belong in `server/authService.ts`.
- Keep network and response parsing in `web/src/api.ts`; UI state belongs in React components.
- Reuse `SlidingWindowAttemptTracker` rather than creating another counter.
- Keep API response shapes stable unless the task explicitly changes the public contract.
- The in-memory tracker is a teaching device, not a production distributed rate limiter.

## Quality

- Use Vitest and add a regression test for every behavior change.
- Cover backend behavior and the user-visible frontend state.
- For rate limiting, cover success, threshold, 429, `Retry-After`, and exact window expiry.
- Run `npm run build` and `npm test` before declaring completion.
- Explain a failing test's root cause with code evidence before changing code.
- Review the final diff for correctness, security, accessibility, compatibility, and missing tests.

## Boundaries

- Do not add dependencies without approval.
- Do not refactor unrelated code.
- Do not read `.env` files or expose credentials.
- Do not push, deploy, or access production resources.
- Ask before destructive commands or changes outside this repository.

## Demo conventions

- Demo account: `belona` / `correct-horse-battery-staple`.
- Login failures deliberately return one generic error to avoid user enumeration.
- A login is blocked only after five failures in a rolling ten-minute window.
- The fifth failure returns 401; the next attempt during the window returns 429.
- A 429 response includes integer `Retry-After` seconds; the UI explains when retry is possible.
