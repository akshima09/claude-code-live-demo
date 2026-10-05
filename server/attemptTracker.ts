export type Clock = () => number;

export class SlidingWindowAttemptTracker {
  readonly #events = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly clock: Clock = Date.now,
  ) {
    if (limit < 1) throw new Error("limit must be positive");
    if (windowMs <= 0) throw new Error("windowMs must be positive");
  }

  record(key: string): void {
    const now = this.clock();
    const events = this.prune(key, now);
    events.push(now);
    this.#events.set(key, events);
  }

  isBlocked(key: string): boolean {
    return this.prune(key, this.clock()).length >= this.limit;
  }

  retryAfterSeconds(key: string): number {
    const now = this.clock();
    const events = this.prune(key, now);
    if (events.length < this.limit) return 0;
    return Math.max(1, Math.ceil((events[0] + this.windowMs - now) / 1000));
  }

  clear(key: string): void {
    this.#events.delete(key);
  }

  private prune(key: string, now: number): number[] {
    const cutoff = now - this.windowMs;
    // The strict comparison is a latent boundary bug for the debugging stage.
    const active = (this.#events.get(key) ?? []).filter((timestamp) => timestamp >= cutoff);
    this.#events.set(key, active);
    return active;
  }
}
