import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import Login from "./Login";

describe("Sign in", () => {
  it("signs in and goes back to the page in ?next", async () => {
    renderAt(<Login mode="login" />, { route: "/login?next=/wishlist", path: "/login" });
    await userEvent.type(screen.getByLabelText("Email"), "sara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByTestId("location")).toHaveTextContent(/^\/wishlist$/);
  });

  it("shows the server error for a wrong password", async () => {
    renderAt(<Login mode="login" />, { route: "/login", path: "/login" });
    await userEvent.type(screen.getByLabelText("Email"), "sara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-pass");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect");
  });

  it("ignores links to other websites in ?next", async () => {
    renderAt(<Login mode="login" />, { route: "/login?next=//evil.example", path: "/login" });
    await userEvent.type(screen.getByLabelText("Email"), "sara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Account page")).toBeInTheDocument();
  });
});

describe("Create account", () => {
  it("shows field errors from the server", async () => {
    renderAt(<Login mode="register" />, { route: "/register", path: "/register" });
    await userEvent.type(screen.getByLabelText("Name"), "Nour");
    await userEvent.type(screen.getByLabelText("Email"), "nour@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
  });
});
