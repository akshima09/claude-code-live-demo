import { type FormEvent, useState } from "react";

import { login, type Member } from "./api.ts";

export function App() {
  const [username, setUsername] = useState("belona");
  const [password, setPassword] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);
      if (!result.ok) {
        setError(result.message);
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
    return (
      <main className="shell">
        <section className="success-card" aria-live="polite">
          <div className="success-icon">✓</div>
          <p className="eyebrow">SECURE SESSION</p>
          <h1>Welcome, {member.displayName}</h1>
          <p>Your member dashboard is ready.</p>
          <button className="secondary-button" onClick={() => setMember(null)}>
            Sign out
          </button>
        </section>
      </main>
    );
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
            A deliberately small member portal for demonstrating safe, full-stack AI-assisted
            engineering.
          </p>
        </div>
        <p className="trust-note">Demo data only · No real member information</p>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow accent">MEMBER ACCESS</p>
            <h2>Sign in</h2>
            <p className="muted">Use your demo credentials to continue.</p>
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
            </div>
          )}

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in securely"}
          </button>

          <p className="demo-hint">
            Demo: <code>belona</code> / <code>correct-horse-battery-staple</code>
          </p>
        </form>
      </section>
    </main>
  );
}

