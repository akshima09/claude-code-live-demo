export type Member = {
  displayName: string;
};

type LoginResult =
  | { ok: true; member: Member }
  | { ok: false; status: number; message: string; retryAfterSeconds?: number };

export async function login(username: string, password: string): Promise<LoginResult> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: body.error?.message ?? "Unable to sign in.",
      retryAfterSeconds: body.error?.retryAfterSeconds,
    };
  }

  return { ok: true, member: body.member };
}

