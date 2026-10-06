// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { App } from "../../web/src/App.tsx";

describe("member login", () => {
  it("shows the member home screen after a successful login", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "demo-token-for-akshima",
          member: { displayName: "Akshima Singh" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in securely" }));

    expect(await screen.findByRole("heading", { name: "Good morning, Akshima" })).toBeInTheDocument();
    expect(screen.getByText("$18,420.67")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recent activity" })).toBeInTheDocument();
  });

  it("returns to sign in when the member signs out", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "demo-token-for-akshima",
          member: { displayName: "Akshima Singh" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "correct-horse-battery-staple" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in securely" }));
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
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

  it("shows a retry countdown and disables the button after a 429", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many failed sign-in attempts. Please try again later.",
            retryAfterSeconds: 5,
          },
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Sign in securely" }));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Try again in 5 seconds.");
    expect(screen.getByRole("button", { name: "Sign in securely" })).toBeDisabled();

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByRole("alert")).toHaveTextContent("Try again in 4 seconds.");

    act(() => vi.advanceTimersByTime(4_000));
    expect(screen.queryByText(/Try again in/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in securely" })).not.toBeDisabled();

    vi.useRealTimers();
  });
});
