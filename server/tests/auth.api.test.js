import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import request from "supertest"

const {
  mockUserFindOne,
  mockUserFindById,
  mockUserSave,
  mockJwtSign,
  mockJwtVerify,
} = vi.hoisted(() => ({
  mockUserFindOne: vi.fn(),
  mockUserFindById: vi.fn(),
  mockUserSave: vi.fn(),
  mockJwtSign: vi.fn(),
  mockJwtVerify: vi.fn(),
}))

vi.mock("../models/User.js", () => {
  const User = vi.fn(function User(data) {
    Object.assign(this, data)
    this.save = mockUserSave
  })

  User.findOne = mockUserFindOne
  User.findById = mockUserFindById

  return {
    default: User,
  }
})

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: mockJwtSign,
    verify: mockJwtVerify,
  },
}))

import app from "../app.js"

describe("Authentication API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/auth/register", () => {
    it("registers a new user", async () => {
      mockUserFindOne.mockResolvedValue(null)

      mockUserSave.mockResolvedValue({
        _id: "user-1",
        name: "Test User",
        email: "test@example.com",
      })

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "TEST@EXAMPLE.COM",
          password: "password123",
        })

      expect(response.status).toBe(201)

      expect(response.body).toEqual({
        message: "User created successfully",
        user: {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
        },
      })

      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: "test@example.com",
      })

      expect(mockUserSave).toHaveBeenCalledOnce()
    })

    it("returns 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Name, email and password are required",
      })

      expect(mockUserFindOne).not.toHaveBeenCalled()
    })

    it("returns 409 when the email is already registered", async () => {
      mockUserFindOne.mockResolvedValue({
        _id: "existing-user",
      })

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        })

      expect(response.status).toBe(409)

      expect(response.body).toEqual({
        error: "Email is already registered",
      })

      expect(mockUserSave).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/auth/login", () => {
    it("logs in a user and sets the access token cookie", async () => {
      const comparePassword = vi.fn()
        .mockResolvedValue(true)

      mockUserFindOne.mockResolvedValue({
        _id: "user-1",
        name: "Test User",
        email: "test@example.com",
        comparePassword,
      })

      mockJwtSign.mockReturnValue("signed-test-token")

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "TEST@EXAMPLE.COM",
          password: "password123",
        })

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        message: "Login successful",
        user: {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
        },
      })

      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: "test@example.com",
      })

      expect(comparePassword).toHaveBeenCalledWith(
        "password123"
      )

      expect(mockJwtSign).toHaveBeenCalledOnce()

      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining(
            "accessToken=signed-test-token"
          ),
        ])
      )
    })

    it("returns 400 when email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Email and password are required",
      })

      expect(mockUserFindOne).not.toHaveBeenCalled()
    })

    it("returns 401 when the user does not exist", async () => {
      mockUserFindOne.mockResolvedValue(null)

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Invalid email or password",
      })
    })

    it("returns 401 when the password is incorrect", async () => {
      const comparePassword = vi.fn()
        .mockResolvedValue(false)

      mockUserFindOne.mockResolvedValue({
        _id: "user-1",
        name: "Test User",
        email: "test@example.com",
        comparePassword,
      })

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrong-password",
        })

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Invalid email or password",
      })

      expect(mockJwtSign).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/auth/logout", () => {
    it("logs out the user and clears the access token cookie", async () => {
      const response = await request(app)
        .post("/api/auth/logout")

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        message: "Logged out successfully",
      })

      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken=;"),
        ])
      )
    })
  })

  describe("GET /api/auth/me", () => {
    it("returns the current user for a valid token", async () => {
      mockJwtVerify.mockReturnValue({
        id: "user-1",
      })

      const select = vi.fn()
        .mockResolvedValue({
          _id: "user-1",
          name: "Test User",
          email: "test@example.com",
        })

      mockUserFindById.mockReturnValue({
        select,
      })

      const response = await request(app)
        .get("/api/auth/me")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        _id: "user-1",
        name: "Test User",
        email: "test@example.com",
      })

      expect(mockJwtVerify).toHaveBeenCalledWith(
        "valid-test-token",
        process.env.JWT_SECRET
      )

      expect(mockUserFindById).toHaveBeenCalledWith(
        "user-1"
      )

      expect(select).toHaveBeenCalledWith("-password")
    })

    it("returns 401 when the access token is missing", async () => {
      const response = await request(app)
        .get("/api/auth/me")

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(mockJwtVerify).not.toHaveBeenCalled()
    })

    it("returns 401 when the access token is invalid", async () => {
      mockJwtVerify.mockImplementation(() => {
        throw new Error("Invalid token")
      })

      const response = await request(app)
        .get("/api/auth/me")
        .set(
          "Cookie",
          "accessToken=invalid-test-token"
        )

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Invalid / Expired Token",
      })
    })

    it("returns 404 when the authenticated user no longer exists", async () => {
      mockJwtVerify.mockReturnValue({
        id: "missing-user",
      })

      const select = vi.fn()
        .mockResolvedValue(null)

      mockUserFindById.mockReturnValue({
        select,
      })

      const response = await request(app)
        .get("/api/auth/me")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )

      expect(response.status).toBe(404)

      expect(response.body).toEqual({
        error: "User not found",
      })
    })
  })
})