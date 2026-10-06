import { type FormEvent, useEffect, useState } from "react";

import { login, type Member } from "./api.ts";
import { Dashboard } from "./Dashboard.tsx";

export function App() {
  const [username, setUsername] = useState("akshima");
  const [password, setPassword] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const id = setInterval(() => setRetryAfter((s) => Math.max(0, s - 1)), 1_000);
    return () => clearInterval(id);
  }, [retryAfter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);
      if (!result.ok) {
        setError(result.message);
        if (result.retryAfterSeconds) setRetryAfter(result.retryAfterSeconds);
        return;
      }
      setMember(result.member);
    } catch {
      setError("The service is unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (member) {
    return <Dashboard member={member} onSignOut={() => setMember(null)} />;
  }

  return (
    <main className="shell">
      <section className="brand-panel">
        <div className="brand-mark" aria-hidden="true">
          N
        </div>
        <div>
          <p className="eyebrow">NORTHSTAR CREDIT UNION</p>
          <h1>Banking that keeps you moving forward.</h1>
          <p className="brand-copy">
            See your accounts, track spending, and move money with confidence—all in one simple place.
          </p>
        </div>
        <p className="trust-note">Demo data only · No real member information</p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow accent">MEMBER ACCESS</p>
            <h2>Sign in</h2>
            <p className="muted">Welcome back. Enter your details to continue.</p>
          </div>

          <label>
            Username
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && (
            <div className="error-message" role="alert">
              {error}
              {retryAfter > 0 && (
                <span> Try again in {retryAfter} second{retryAfter === 1 ? "" : "s"}.</span>
              )}
            </div>
          )}

          <button className="primary-button" disabled={loading || retryAfter > 0} type="submit">
            {loading ? "Signing in…" : "Sign in securely"}
          </button>

          <p className="demo-hint">
            Demo: <code>akshima</code> / <code>correct-horse-battery-staple</code>
          </p>
        </form>
      </section>
    </main>
  );
}
