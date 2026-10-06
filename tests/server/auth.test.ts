import request from "supertest";

import { SlidingWindowAttemptTracker } from "../../server/attemptTracker.ts";
import { createApp } from "../../server/app.ts";

describe("POST /api/login", () => {
  it("returns the existing success contract for valid credentials", async () => {
    const response = await request(createApp()).post("/api/login").send({
      username: "akshima",
      password: "correct-horse-battery-staple",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "demo-token-for-akshima",
      member: { displayName: "Akshima Singh" },
    });
  });

  it("uses the same error for a wrong password and an unknown member", async () => {
    const app = createApp();
    const wrongPassword = await request(app).post("/api/login").send({
      username: "akshima",
      password: "wrong",
    });
    const unknownMember = await request(app).post("/api/login").send({
      username: "someone-else",
      password: "wrong",
    });

    expect(wrongPassword.status).toBe(401);
    expect(unknownMember.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownMember.body);
  });

  it("rejects unexpected fields", async () => {
    const response = await request(createApp()).post("/api/login").send({
      username: "akshima",
      password: "wrong",
      isAdmin: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
  });

  describe("rate limiting", () => {
    it("allows the first five failures and returns 401 each time", async () => {
      const app = createApp();
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post("/api/login")
          .send({ username: "akshima", password: "wrong" });
        expect(response.status).toBe(401);
      }
    });

    it("returns 429 on the sixth attempt within the window", async () => {
      const app = createApp();
      for (let i = 0; i < 5; i++) {
        await request(app).post("/api/login").send({ username: "akshima", password: "wrong" });
      }
      const response = await request(app)
        .post("/api/login")
        .send({ username: "akshima", password: "wrong" });
      expect(response.status).toBe(429);
      expect(response.body.error.code).toBe("TOO_MANY_REQUESTS");
    });

    it("includes a Retry-After header and retryAfterSeconds in the 429 body", async () => {
      const app = createApp();
      for (let i = 0; i < 5; i++) {
        await request(app).post("/api/login").send({ username: "akshima", password: "wrong" });
      }
      const response = await request(app)
        .post("/api/login")
        .send({ username: "akshima", password: "wrong" });
      expect(Number(response.headers["retry-after"])).toBeGreaterThan(0);
      expect(response.body.error.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("restores access after the window expires", async () => {
      let now = 0;
      const tracker = new SlidingWindowAttemptTracker(5, 10 * 60 * 1000, () => now);
      const app = createApp(tracker);

      for (let i = 0; i < 5; i++) {
        await request(app).post("/api/login").send({ username: "akshima", password: "wrong" });
      }
      now += 10 * 60 * 1000 + 1;

      const response = await request(app)
        .post("/api/login")
        .send({ username: "akshima", password: "correct-horse-battery-staple" });
      expect(response.status).toBe(200);
    });

    it("clears the attempt counter after a successful login", async () => {
      const app = createApp();
      for (let i = 0; i < 3; i++) {
        await request(app).post("/api/login").send({ username: "akshima", password: "wrong" });
      }
      await request(app)
        .post("/api/login")
        .send({ username: "akshima", password: "correct-horse-battery-staple" });

      for (let i = 0; i < 5; i++) {
        const r = await request(app)
          .post("/api/login")
          .send({ username: "akshima", password: "wrong" });
        expect(r.status).toBe(401);
      }
    });
  });
});
