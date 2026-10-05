# Optional MCP segment

Do not make MCP part of the critical path. It adds setup and network/version risk without strengthening
the main explore-plan-implement-debug-review story.

If the audience specifically needs MCP, use a pre-approved, read-only issue-tracker or documentation
server already available in your organization. Demonstrate one action: fetch the acceptance criteria
for the login-rate-limit ticket, then disconnect or stop using the server.

Narrate three points:

1. MCP standardizes how an AI application connects to external tools and data.
2. A connector provides capability; project/user permission still determines whether it may be used.
3. Tool descriptions and returned content are untrusted input. Scope credentials and tools narrowly.

Avoid live-installing an arbitrary public server, granting write access to a real issue tracker, or
showing production data. A prerecorded screenshot is safer if your organization has no vetted server.

