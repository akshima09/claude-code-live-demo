import express, { type Express } from "express";
import { z } from "zod";

import { authenticate } from "./authService.ts";
import { requestPasswordReset } from "./passwordReset.ts";
import type { ApiError, LoginSuccess } from "./types.ts";

const loginSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

export function createApp(): Express {
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

    const result = authenticate(parsed.data.username, parsed.data.password);
    if (!result) {
      const body: ApiError = {
        error: { code: "INVALID_CREDENTIALS", message: "Username or password is incorrect." },
      };
      response.status(401).json(body);
      return;
    }

    const body: LoginSuccess = result;
    response.json(body);
  });

  app.post("/api/password-reset", requestPasswordReset);
  return app;
}

