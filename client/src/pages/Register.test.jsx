import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const { mockRegisterUser } = vi.hoisted(() => ({
  mockRegisterUser: vi.fn(),
}))

vi.mock("../services/authApi.js", () => ({
  registerUser: mockRegisterUser,
}))

vi.mock("../components/AuthPage.jsx", () => ({
  default: ({
    children,
    title,
    description,
    footerText,
    footerLink,
    footerLabel,
  }) => (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>

      {children}

      {footerText && (
        <p>
          {footerText}{" "}
          <a href={footerLink}>{footerLabel}</a>
        </p>
      )}
    </main>
  ),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")

  return {
    ...actual,
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

import Register from "./Register.jsx"

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the registration form fields and submit button", () => {
    render(<Register />)

    expect(
      screen.getByRole("heading", {
        name: "Create your account",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Full name")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Email address")
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", {
        name: "Register",
      })
    ).toBeInTheDocument()
  })

  it("shows required validation errors when submitted empty", async () => {
    const user = userEvent.setup()

    render(<Register />)

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      screen.getByText("Full name is required")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Email address is required")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Password is required")
    ).toBeInTheDocument()

    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("shows a validation error for an invalid email", async () => {
    const user = userEvent.setup()

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "invalid-email"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument()

    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("shows a validation error for a short password", async () => {
    const user = userEvent.setup()

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "12345"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      screen.getByText(
        "Password must be at least 6 characters"
      )
    ).toBeInTheDocument()

    expect(mockRegisterUser).not.toHaveBeenCalled()
  })

  it("registers with the entered user details", async () => {
    const user = userEvent.setup()

    mockRegisterUser.mockResolvedValue({
      user: {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      },
    })

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledTimes(1)
    })

    expect(mockRegisterUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    })
  })

  it("shows the account-created state after successful registration", async () => {
    const user = userEvent.setup()

    mockRegisterUser.mockResolvedValue({
      user: {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      },
    })

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      await screen.findByRole("heading", {
        name: "Account created",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("status")
    ).toHaveTextContent(
      "Your account has been created successfully."
    )

    expect(
      screen.getByRole("link", {
        name: "Proceed to login",
      })
    ).toHaveAttribute("href", "/login")

    expect(
      screen.queryByRole("textbox", {
        name: "Full name",
      })
    ).not.toBeInTheDocument()
  })

  it("displays the API error returned by registration", async () => {
    const user = userEvent.setup()

    mockRegisterUser.mockRejectedValue(
      new Error("Email is already registered")
    )

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Email is already registered"
    )
  })

  it("uses the fallback error when the API error has no message", async () => {
    const user = userEvent.setup()

    mockRegisterUser.mockRejectedValue({})

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Registration failed. Please try again."
    )
  })

  it("clears the API error when the user edits a field", async () => {
    const user = userEvent.setup()

    mockRegisterUser.mockRejectedValue(
      new Error("Email is already registered")
    )

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Email is already registered"
    )

    await user.type(
      screen.getByLabelText("Full name"),
      "x"
    )

    expect(
      screen.queryByText("Email is already registered")
    ).not.toBeInTheDocument()
  })

  it("shows the submitting state while registration is in progress", async () => {
    const user = userEvent.setup()

    let resolveRegistration

    mockRegisterUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegistration = resolve
        })
    )

    render(<Register />)

    await user.type(
      screen.getByLabelText("Full name"),
      "John Doe"
    )

    await user.type(
      screen.getByLabelText("Email address"),
      "john@example.com"
    )

    await user.type(
      screen.getByLabelText("Password"),
      "password123"
    )

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      })
    )

    const submitButton = screen.getByRole("button", {
      name: /Creating account/i,
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(
      "Creating account..."
    )

    resolveRegistration({
      user: {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Account created",
        })
      ).toBeInTheDocument()
    })
  })
})