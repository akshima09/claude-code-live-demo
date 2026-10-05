import request from "supertest";

import { createApp } from "../../server/app.ts";

describe("POST /api/login", () => {
  it("returns the existing success contract for valid credentials", async () => {
    const response = await request(createApp()).post("/api/login").send({
      username: "belona",
      password: "correct-horse-battery-staple",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "demo-token-for-belona",
      member: { displayName: "Belona Singh" },
    });
  });

  it("uses the same error for a wrong password and an unknown member", async () => {
    const app = createApp();
    const wrongPassword = await request(app).post("/api/login").send({
      username: "belona",
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
      username: "belona",
      password: "wrong",
      isAdmin: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
  });
});

