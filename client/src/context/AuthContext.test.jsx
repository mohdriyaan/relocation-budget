import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const {
  mockLoginApi,
  mockLogoutApi,
  mockGetCurrentUser,
} = vi.hoisted(() => ({
  mockLoginApi: vi.fn(),
  mockLogoutApi: vi.fn(),
  mockGetCurrentUser: vi.fn(),
}))

vi.mock("../services/authApi.js", () => ({
  login: mockLoginApi,
  logout: mockLogoutApi,
  getCurrentUser: mockGetCurrentUser,
}))

import { AuthProvider } from "./AuthContext.jsx"
import AuthContext from "./authContext.js"

const TestConsumer = () => {
  const { user, loading, login, logout } =
    React.useContext(AuthContext)

  const handleLogin = async () => {
    try {
      await login({
        email: "login@example.com",
        password: "password123",
      })
    } catch {
      // Intentionally ignore the error so the test
      // can verify that authentication state is unchanged.
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Intentionally ignore the error so the test
      // can verify that authentication state is unchanged.
    }
  }

  return (
    <div>
      <p data-testid="loading">
        {loading ? "loading" : "ready"}
      </p>

      <p data-testid="user">
        {user ? user.email : "No user"}
      </p>

      <button
        type="button"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGetCurrentUser.mockResolvedValue(null)

    mockLoginApi.mockResolvedValue({
      user: {
        id: "user-1",
        email: "login@example.com",
      },
    })

    mockLogoutApi.mockResolvedValue({
      message: "Logged out successfully",
    })
  })

  const renderProvider = () =>
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

  it("starts in the loading state while restoring the session", async () => {
    let resolveCurrentUser

    mockGetCurrentUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCurrentUser = resolve
        })
    )

    renderProvider()

    expect(
      screen.getByTestId("loading")
    ).toHaveTextContent("loading")

    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1)

    resolveCurrentUser(null)

    await waitFor(() => {
      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("ready")
    })
  })

  it("restores the current user when session restoration succeeds", async () => {
    const currentUser = {
      id: "user-1",
      email: "current@example.com",
    }

    mockGetCurrentUser.mockResolvedValue(currentUser)

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("current@example.com")
    })

    expect(
      screen.getByTestId("loading")
    ).toHaveTextContent("ready")

    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1)
  })

  it("sets the user to null when session restoration fails", async () => {
    mockGetCurrentUser.mockRejectedValue(
      new Error("Session expired")
    )

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("ready")
    })

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("No user")
  })

  it("logs in and updates the authenticated user", async () => {
    const user = userEvent.setup()

    const loginResponse = {
      user: {
        id: "user-1",
        email: "login@example.com",
      },
    }

    mockGetCurrentUser.mockResolvedValue(null)
    mockLoginApi.mockResolvedValue(loginResponse)

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("ready")
    })

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      })
    )

    await waitFor(() => {
      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("login@example.com")
    })

    expect(mockLoginApi).toHaveBeenCalledTimes(1)

    expect(mockLoginApi).toHaveBeenCalledWith({
      email: "login@example.com",
      password: "password123",
    })
  })

  it("does not update the user when login fails", async () => {
    const user = userEvent.setup()

    mockGetCurrentUser.mockResolvedValue(null)

    mockLoginApi.mockRejectedValue(
      new Error("Invalid credentials")
    )

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("ready")
    })

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      })
    )

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledTimes(1)
    })

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("No user")
  })

  it("logs out and clears the authenticated user", async () => {
    const user = userEvent.setup()

    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "current@example.com",
    })

    mockLogoutApi.mockResolvedValue({
      message: "Logged out successfully",
    })

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("current@example.com")
    })

    await user.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    )

    await waitFor(() => {
      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("No user")
    })

    expect(mockLogoutApi).toHaveBeenCalledTimes(1)
  })

  it("keeps the user when logout fails", async () => {
    const user = userEvent.setup()

    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "current@example.com",
    })

    mockLogoutApi.mockRejectedValue(
      new Error("Logout failed")
    )

    renderProvider()

    await waitFor(() => {
      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("current@example.com")
    })

    await user.click(
      screen.getByRole("button", {
        name: "Logout",
      })
    )

    await waitFor(() => {
      expect(mockLogoutApi).toHaveBeenCalledTimes(1)
    })

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("current@example.com")
  })
})