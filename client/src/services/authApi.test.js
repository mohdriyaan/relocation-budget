import { beforeEach, describe, expect, it, vi } from "vitest"

const mockFetch = vi.fn()

vi.stubGlobal("fetch", mockFetch)

const mockJsonResponse = (body, options = {}) => ({
  ok: options.ok ?? true,
  json: vi.fn().mockResolvedValue(body),
})

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("login", () => {
    it("sends login credentials and returns the response", async () => {
      const response = {
        user: {
          id: "user-1",
          email: "test@example.com",
        },
      }

      mockFetch.mockResolvedValue(
        mockJsonResponse(response)
      )

      const { login } = await import("./authApi.js")

      const result = await login({
        email: "test@example.com",
        password: "password123",
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
          credentials: "include",
        }
      )

      expect(result).toEqual(response)
    })

    it("throws the server error when login fails", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse(
          {
            error: "Invalid credentials",
          },
          { ok: false }
        )
      )

      const { login } = await import("./authApi.js")

      await expect(
        login({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Invalid credentials")
    })

    it("uses the fallback error when login fails without an error message", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({}, { ok: false })
      )

      const { login } = await import("./authApi.js")

      await expect(
        login({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Unable to login user")
    })
  })

  describe("logout", () => {
    it("sends the logout request with credentials", async () => {
      const response = {
        message: "Logged out successfully",
      }

      mockFetch.mockResolvedValue(
        mockJsonResponse(response)
      )

      const { logout } = await import("./authApi.js")

      const result = await logout()

      expect(mockFetch).toHaveBeenCalledTimes(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        {
          method: "POST",
          credentials: "include",
        }
      )

      expect(result).toEqual(response)
    })

    it("throws the server error when logout fails", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse(
          {
            error: "Logout failed",
          },
          { ok: false }
        )
      )

      const { logout } = await import("./authApi.js")

      await expect(
        logout()
      ).rejects.toThrow("Logout failed")
    })

    it("uses the fallback error when logout fails without an error message", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({}, { ok: false })
      )

      const { logout } = await import("./authApi.js")

      await expect(
        logout()
      ).rejects.toThrow("Unable to logout")
    })
  })

  describe("getCurrentUser", () => {
    it("requests the current user with credentials", async () => {
      const user = {
        id: "user-1",
        email: "current@example.com",
      }

      mockFetch.mockResolvedValue(
        mockJsonResponse(user)
      )

      const { getCurrentUser } = await import("./authApi.js")

      const result = await getCurrentUser()

      expect(mockFetch).toHaveBeenCalledTimes(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/me"),
        {
          method: "GET",
          credentials: "include",
        }
      )

      expect(result).toEqual(user)
    })

    it("throws the server error when fetching the current user fails", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse(
          {
            error: "Unauthorized",
          },
          { ok: false }
        )
      )

      const { getCurrentUser } = await import("./authApi.js")

      await expect(
        getCurrentUser()
      ).rejects.toThrow("Unauthorized")
    })

    it("uses the fallback error when current-user retrieval fails without an error message", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({}, { ok: false })
      )

      const { getCurrentUser } = await import("./authApi.js")

      await expect(
        getCurrentUser()
      ).rejects.toThrow("Unable to get current user")
    })
  })

  describe("registerUser", () => {
    it("sends registration details and returns the response", async () => {
      const response = {
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
        },
      }

      const userDetails = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      mockFetch.mockResolvedValue(
        mockJsonResponse(response)
      )

      const { registerUser } = await import("./authApi.js")

      const result = await registerUser(userDetails)

      expect(mockFetch).toHaveBeenCalledTimes(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
          credentials: "include",
        }
      )

      expect(result).toEqual(response)
    })

    it("throws the server error when registration fails", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse(
          {
            error: "Email already registered",
          },
          { ok: false }
        )
      )

      const { registerUser } = await import("./authApi.js")

      await expect(
        registerUser({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email already registered")
    })

    it("uses the fallback error when registration fails without an error message", async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({}, { ok: false })
      )

      const { registerUser } = await import("./authApi.js")

      await expect(
        registerUser({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Unable to register user")
    })
  })
})