import express, { type Express } from "express";
import { z } from "zod";

import { authenticate } from "./authService.ts";
import { SlidingWindowAttemptTracker } from "./attemptTracker.ts";
import { requestPasswordReset } from "./passwordReset.ts";
import type { ApiError, LoginSuccess } from "./types.ts";

const loginSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

export function createApp(
  loginAttempts = new SlidingWindowAttemptTracker(5, 10 * 60 * 1000),
): Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/api/login", (request, response) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      const body: ApiError = {
        error: { code: "INVALID_REQUEST", message: "Username and password are required." },
      };
      response.status(400).json(body);
      return;
    }

    const { username, password } = parsed.data;
    const key = username.toLocaleLowerCase();

    if (loginAttempts.isBlocked(key)) {
      const retryAfterSeconds = loginAttempts.retryAfterSeconds(key);
      response.setHeader("Retry-After", String(retryAfterSeconds));
      const body: ApiError = {
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Too many failed sign-in attempts. Please try again later.",
          retryAfterSeconds,
        },
      };
      response.status(429).json(body);
      return;
    }

    const result = authenticate(username, password);
    if (!result) {
      loginAttempts.record(key);
      const body: ApiError = {
        error: { code: "INVALID_CREDENTIALS", message: "Username or password is incorrect." },
      };
      response.status(401).json(body);
      return;
    }

    loginAttempts.clear(key);
    const body: LoginSuccess = result;
    response.json(body);
  });

  app.post("/api/password-reset", requestPasswordReset);
  return app;
}

