import { SlidingWindowAttemptTracker } from "../../server/attemptTracker.ts";

describe("SlidingWindowAttemptTracker", () => {
  it("blocks at the configured limit and can be cleared", () => {
    let now = 0;
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => now);

    tracker.record("akshima");
    expect(tracker.isBlocked("akshima")).toBe(false);

    now += 1_000;
    tracker.record("akshima");
    expect(tracker.isBlocked("akshima")).toBe(true);

    tracker.clear("akshima");
    expect(tracker.isBlocked("akshima")).toBe(false);
  });

  it("returns 0 from retryAfterSeconds when not blocked", () => {
    const tracker = new SlidingWindowAttemptTracker(3, 60_000, () => 0);
    expect(tracker.retryAfterSeconds("akshima")).toBe(0);
    tracker.record("akshima");
    tracker.record("akshima");
    expect(tracker.retryAfterSeconds("akshima")).toBe(0);
  });

  it("returns positive retryAfterSeconds when blocked", () => {
    let now = 0;
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => now);
    tracker.record("akshima"); // t=0
    now += 1_000;
    tracker.record("akshima"); // t=1000
    // oldest event at t=0, window=60s, elapsed=1s → 59s remaining
    expect(tracker.retryAfterSeconds("akshima")).toBe(59);
  });

  it("prunes events older than the window and unblocks the key", () => {
    let now = 0;
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => now);
    tracker.record("akshima");
    tracker.record("akshima");
    expect(tracker.isBlocked("akshima")).toBe(true);

    now += 60_001;
    expect(tracker.isBlocked("akshima")).toBe(false);
  });

  it("retains an event at exactly the window boundary (known boundary behavior)", () => {
    let now = 0;
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => now);
    tracker.record("akshima"); // t=0
    tracker.record("akshima"); // t=0
    expect(tracker.isBlocked("akshima")).toBe(true);

    // At exactly t=60_000: cutoff = 60_000 - 60_000 = 0, event at 0 satisfies >= 0
    now = 60_000;
    expect(tracker.isBlocked("akshima")).toBe(true);
  });

  it("clear on an unknown key is a no-op", () => {
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => 0);
    expect(() => tracker.clear("nobody")).not.toThrow();
    expect(tracker.isBlocked("nobody")).toBe(false);
  });

  it("rejects non-positive constructor arguments", () => {
    expect(() => new SlidingWindowAttemptTracker(0, 60_000)).toThrow("limit must be positive");
    expect(() => new SlidingWindowAttemptTracker(-1, 60_000)).toThrow("limit must be positive");
    expect(() => new SlidingWindowAttemptTracker(1, 0)).toThrow("windowMs must be positive");
  });
});
