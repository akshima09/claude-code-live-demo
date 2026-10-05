// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { App } from "../../web/src/App.tsx";

describe("member login", () => {
  it("shows the member welcome state after a successful login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "demo-token-for-belona",
          member: { displayName: "Belona Singh" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in securely" }));

    expect(await screen.findByText("Welcome, Belona Singh")).toBeInTheDocument();
  });

  it("shows the server's generic authentication error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: "INVALID_CREDENTIALS", message: "Username or password is incorrect." },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in securely" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Username or password is incorrect.");
    });
  });
});

