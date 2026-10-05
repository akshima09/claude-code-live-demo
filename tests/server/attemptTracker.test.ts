import { SlidingWindowAttemptTracker } from "../../server/attemptTracker.ts";

describe("SlidingWindowAttemptTracker", () => {
  it("blocks at the configured limit and can be cleared", () => {
    let now = 0;
    const tracker = new SlidingWindowAttemptTracker(2, 60_000, () => now);

    tracker.record("belona");
    expect(tracker.isBlocked("belona")).toBe(false);

    now += 1_000;
    tracker.record("belona");
    expect(tracker.isBlocked("belona")).toBe(true);

    tracker.clear("belona");
    expect(tracker.isBlocked("belona")).toBe(false);
  });
});

