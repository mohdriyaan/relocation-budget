import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import Login from "./Login.jsx"

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock("../hooks/useAuth.js", () => ({
  default: () => ({
    login: mockLogin,
  }),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("../components/AuthPage.jsx", () => ({
  default: ({ children, title, description, footerText, footerLink, footerLabel }) => (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>

      {children}

      <p>
        {footerText}{" "}
        <a href={footerLink}>{footerLabel}</a>
      </p>
    </main>
  ),
}))

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the login form fields and submit button", () => {
    render(<Login />)

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Email address")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: "Log in" })
    ).toBeInTheDocument()
  })

  it("shows required validation errors when submitted empty", async () => {
    const user = userEvent.setup()

    render(<Login />)

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Password is required")
    ).toBeInTheDocument()

    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("shows a validation error for an invalid email", async () => {
    const user = userEvent.setup()

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "invalid-email"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument()

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it("logs in with the entered credentials", async () => {
    const user = userEvent.setup()

    mockLogin.mockResolvedValue({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    })

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1)
    })

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
  })

  it("navigates to the dashboard after successful login", async () => {
    const user = userEvent.setup()

    mockLogin.mockResolvedValue({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    })

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/")
    })
  })

  it("displays the API error returned by login", async () => {
    const user = userEvent.setup()

    mockLogin.mockRejectedValue(
      new Error("Invalid credentials")
    )

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Invalid credentials")

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("uses the fallback error when the API error has no message", async () => {
    const user = userEvent.setup()

    mockLogin.mockRejectedValue({})

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Invalid email or password")
  })

  it("clears the API error when the user edits the email field", async () => {
    const user = userEvent.setup()

    mockLogin.mockRejectedValue(
      new Error("Invalid credentials")
    )

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Invalid credentials")

    await user.type(
      screen.getByLabelText("Email address"),
      "x"
    )

    expect(
      screen.queryByText("Invalid credentials")
    ).not.toBeInTheDocument()
  })

  it("clears the API error when the user edits the password field", async () => {
    const user = userEvent.setup()

    mockLogin.mockRejectedValue(
      new Error("Invalid credentials")
    )

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Invalid credentials")

    await user.type(
      screen.getByLabelText("Password"),
      "x"
    )

    expect(
      screen.queryByText("Invalid credentials")
    ).not.toBeInTheDocument()
  })

  it("shows the submitting state while login is in progress", async () => {
    const user = userEvent.setup()

    let resolveLogin

    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve
        })
    )

    render(<Login />)

    await user.type(
      screen.getByLabelText("Email address"),
      "test@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", { name: "Log in" })
    )

    expect(
      screen.getByRole("button", { name: /Logging in/i })
    ).toBeDisabled()

    expect(
      screen.getByRole("button", { name: /Logging in/i })
    ).toHaveTextContent("Logging in...")

    resolveLogin({
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Log in" })
      ).toBeInTheDocument()
    })
  })
})