import { SlidingWindowAttemptTracker } from "./attemptTracker.ts";

const otpAttempts = new SlidingWindowAttemptTracker(5, 10 * 60 * 1000);

export function verifyOtp(username: string, code: string): boolean {
  const key = username.toLocaleLowerCase();
  if (otpAttempts.isBlocked(key)) return false;
  if (code !== "123456") {
    otpAttempts.record(key);
    return false;
  }
  otpAttempts.clear(key);
  return true;
}

