# Presenter runbook

## Recommended format: 35 minutes + Q&A

The deck has more concepts than one demo can responsibly prove. Use the slides for vocabulary and
the repository for one end-to-end story. Trying to live-demo every interface, model, MCP server, and
permission mode will fragment the session and increase failure risk.

| Time | Segment | What you show |
|---:|---|---|
| 0–5 min | Framing | Claude versus Claude Code; agent has repository and tool access |
| 5–9 min | Controls | context, `CLAUDE.md`, model/effort, Plan and Ask permissions |
| 9–12 min | Working app | run portal; good login works; repeated failures are not blocked |
| 12–16 min | Explore + plan | use the first two prompts in Plan mode |
| 16–23 min | Implement | approve a narrow full-stack change and inspect edits |
| 23–27 min | Debug | prove the exact-window defect before patching |
| 27–31 min | Verify + review | build, tests, diff, security review |
| 31–35 min | Takeaway | capability is not permission; generation is not verification |
| 35+ min | Q&A | use the questions below |

## Before the room opens

Run this at least once on the presentation machine:

```bash
git switch main
npm install
npm run check
npm run dev
```

Then verify:

- <http://localhost:5173> loads without relying on venue Wi-Fi after packages are installed.
- The correct demo credential reaches the welcome view.
- Claude Code is installed, authenticated, and visible in VS Code.
- Project trust and `.claude/settings.json` permission prompts behave as expected.
- Font size is at least 18 px in the editor and terminal; notifications are muted.
- No personal repositories, tokens, `.env` files, or browser tabs are visible.
- `demo-start`, `demo-debug`, and `demo-solution` refs exist.
- You have the prompts open in a separate, non-projected window or printed.

## Opening script

“This is not a code-generation demo. It is a controlled engineering workflow. Claude can read the
repository and use tools, but the developer sets context, scope, permissions, and the evidence needed
for acceptance.”

Show the working portal first. A successful login proves the baseline. Enter a wrong password several
times and point out that nothing slows an attacker yet.

## Permission narration

Start in **Plan mode**. Say: “The agent may inspect, but I want to approve the approach before it
changes source.” After the plan, use **Ask permissions** for the clearest teaching moment, or **Auto
accept edits** if timing is tight. Do not use Bypass permissions on the presentation machine.

The project settings intentionally pre-approve only routine status/diff/build/test commands, ask for
edits and installs, and deny `.env` reads, pushes, and a destructive command pattern. Explain that
rules reduce risk; they do not replace code review or OS/container isolation.

## What a good plan contains

- Normalize the identifier once and key failed attempts consistently.
- Check whether the account is blocked before authenticating.
- Record only failed attempts and clear after success.
- Preserve existing 200 and 401 JSON.
- Return 429 plus integer `Retry-After` seconds.
- Surface the blocked state in accessible UI and prevent pointless resubmission.
- Inject a clock/tracker for deterministic tests.
- Explicitly call out the single-process limitation.

Reject the plan if it adds an npm package for a behavior already supported by the repository, stores
passwords or tokens in logs, changes unrelated design, relies on real time in tests, or describes the
in-memory limiter as production-grade.

## Debug narration

On `demo-debug`, the boundary test fails because an event exactly ten minutes old remains active. Ask
for evidence first. The smallest fix changes the active-window comparison from inclusive to exclusive:
at `now - window`, the event is expired. This is a useful demonstration because the code looks
plausible, the normal tests pass, and only a precise boundary test establishes the contract.

## Security review talking points

The finished demo is still intentionally incomplete for production:

- Per-process memory is inconsistent across replicas and disappears on restart. Use an atomic shared
  store or gateway-level limiter in a distributed deployment.
- Username-only throttling enables targeted account lockout. Real controls usually combine account,
  IP/network, device/risk signals, progressive delays, monitoring, and recovery protections.
- `Retry-After` is good HTTP behavior but reveals the lock duration; decide deliberately.
- The demo password hash is SHA-256 only to avoid unrelated dependencies. Production password storage
  requires a password KDF and mature identity controls.
- Rate limiting mitigates abuse; it does not make authentication “secure.”

## Recovery plan

If the agent is slow or edits drift from scope:

1. Stop the response and say that interruption is a developer control.
2. Do not improvise destructive Git commands on stage.
3. If the tree is clean, run `./scripts/demo-stage debug` and continue with debugging.
4. For the final state, run `./scripts/demo-stage solution`.

If Wi-Fi or model access fails, the Git stages still let you show diffs and run the application/tests.
The session therefore remains an engineering walkthrough rather than becoming dead air.

## Likely Q&A

**Why not just use Copilot/autocomplete?**  Autocomplete proposes local code. A coding agent can trace
repository context, edit multiple files, run checks, and iterate. That broader capability also raises
the need for permissions and review.

**Should we always start in Plan mode?**  No. It is useful for uncertain, multi-file, or high-risk
work. It is overhead for a trivial, well-specified edit. Match control to risk.

**Can `CLAUDE.md` enforce policy?**  No. It guides behavior. Permissions, hooks, sandboxing, CI, branch
protection, and human approval enforce boundaries.

**Is MCP safe?**  MCP is an integration protocol, not a safety guarantee. Each server adds tools,
data access, trust dependencies, and prompt-injection surface. Connect only what the task needs.

**How do we know the answer is correct?**  We do not accept prose confidence. We inspect the diff,
run deterministic checks, test edge conditions, and distinguish verified properties from assumptions.

