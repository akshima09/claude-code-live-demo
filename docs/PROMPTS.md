# Live prompt pack

Use one prompt per engineering stage. Do not paste the entire sequence at once; the point is to show
that the developer remains in control.

## 1. Explore — Plan mode, 2–3 minutes

```text
Trace member login from the React form through the API client, Express route, authentication service,
and tests. Identify where failed attempts are currently handled and what reusable rate-limiting
pattern already exists. Explain the response contracts. Do not edit files.
```

What to watch for: `web/src/App.tsx` → `web/src/api.ts` → `server/app.ts` →
`server/authService.ts`; `server/passwordReset.ts` and `server/otp.ts` use the shared tracker.

## 2. Plan — stay in Plan mode, 2 minutes

```text
Plan the smallest full-stack change for login brute-force protection: after five failed attempts for
the same normalized username within ten minutes, block subsequent attempts with HTTP 429 and an
integer Retry-After header. Preserve existing success and 401 bodies. The React UI must explain the
temporary block and disable sign-in until retry is possible. List files, edge cases, tests, and any
security limitations. Do not edit yet.
```

Approve only if the plan reuses `SlidingWindowAttemptTracker`, keeps the route thin, covers backend
and frontend tests, and does not claim the in-memory design is production-ready.

## 3. Implement — Auto accept edits or Ask permissions, 4–7 minutes

```text
Implement the approved plan. Follow CLAUDE.md, avoid unrelated refactors, add deterministic backend
and UI tests, and run the relevant checks. If a test fails, stop after reporting the failure and your
initial evidence; do not guess at a fix.
```

If time is tight, switch to the prepared debug stage instead: `./scripts/demo-stage debug`.

## 4. Debug — Plan mode, 2–4 minutes

Use this on `demo-debug`, where one exact-window test intentionally fails:

```text
Investigate the failing exact-window test. Trace the values through the tracker, identify the root
cause with specific code and test evidence, and recommend the smallest safe fix. Do not edit yet.
```

After Claude proves the off-by-one boundary:

```text
Apply only that fix, run the focused test, then run the full checks. Explain why the comparison is
correct at exactly ten minutes.
```

## 5. Verify — 1–2 minutes

```text
Run the full build and test suite. Summarize what was actually verified, and separate that from what
still requires production validation. Do not make more changes unless a check fails.
```

## 6. Review — Plan mode, 2–3 minutes

```text
Review the final diff as a senior application-security engineer. Report findings by severity with
file evidence. Check bypasses, username normalization, Retry-After behavior, concurrency, multi-node
deployment, accessibility, API compatibility, and missing tests. Do not edit.
```

The desired review should flag the in-memory, per-process tracker and the user-lockout/identifier
spray tradeoff. A review that says only “looks good” is weak.

## Prompting-pattern mini-demo

These variants map directly to the session deck:

- Zero-shot: `Add rate limiting to login and add tests.`
- One-shot: `Follow the request-tracking and error pattern in server/passwordReset.ts.`
- Few-shot: `Study server/passwordReset.ts, server/otp.ts, and server/signup.ts; identify the common validation pattern, then implement login protection consistently.`
- Role: `Act as a senior application-security engineer and recommend the smallest safe change.`
- Contextual: `Using web/src/App.tsx, web/src/api.ts, server/app.ts, server/authService.ts, and the existing tests, add protection without changing the current 200/401 response bodies.`

Show these as comparisons; do not run all five during the live demo.

