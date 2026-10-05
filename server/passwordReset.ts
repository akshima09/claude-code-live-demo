import type { Request, Response } from "express";

import { SlidingWindowAttemptTracker } from "./attemptTracker.ts";

const resetRequests = new SlidingWindowAttemptTracker(3, 5 * 60 * 1000);

export function requestPasswordReset(request: Request, response: Response): void {
  const username = String(request.body?.username ?? "").toLocaleLowerCase();
  if (resetRequests.isBlocked(username)) {
    response.status(429).json({
      error: { code: "TOO_MANY_REQUESTS", message: "Please try again later." },
    });
    return;
  }

  resetRequests.record(username);
  response.json({ message: "If the account exists, reset instructions were sent." });
}

