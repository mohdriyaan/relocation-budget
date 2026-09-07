import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import request from "supertest"

const {
  mockBudgetFindOne,
  mockBudgetFindOneAndUpdate,
  mockJwtVerify,
} = vi.hoisted(() => ({
  mockBudgetFindOne: vi.fn(),
  mockBudgetFindOneAndUpdate: vi.fn(),
  mockJwtVerify: vi.fn(),
}))

vi.mock("../models/Budget.js", () => ({
  default: {
    findOne: mockBudgetFindOne,
    findOneAndUpdate: mockBudgetFindOneAndUpdate,
  },
}))

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}))

import app from "../app.js"

describe("Budget API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const authenticate = () => {
    mockJwtVerify.mockReturnValue({
      id: "user-1",
    })
  }

  describe("GET /api/budget/", () => {
    it("returns the authenticated user's budget", async () => {
      authenticate()

      const budget = {
        _id: "budget-1",
        user: "user-1",
        savings: 50000,
        originCurrency: "INR",
        destinationCurrency: "NZD",
      }

      mockBudgetFindOne.mockResolvedValue(budget)

      const response = await request(app)
        .get("/api/budget/")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        budget,
      })

      expect(mockBudgetFindOne).toHaveBeenCalledWith({
        user: "user-1",
      })
    })

    it("returns 401 when the access token is missing", async () => {
      const response = await request(app)
        .get("/api/budget/")

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(mockBudgetFindOne).not.toHaveBeenCalled()
    })

    it("returns 401 when the access token is invalid", async () => {
      mockJwtVerify.mockImplementation(() => {
        throw new Error("Invalid token")
      })

      const response = await request(app)
        .get("/api/budget/")
        .set(
          "Cookie",
          "accessToken=invalid-test-token"
        )

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Invalid / Expired Token",
      })

      expect(mockBudgetFindOne).not.toHaveBeenCalled()
    })

    it("returns 404 when the user has no budget", async () => {
      authenticate()

      mockBudgetFindOne.mockResolvedValue(null)

      const response = await request(app)
        .get("/api/budget/")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )

      expect(response.status).toBe(404)

      expect(response.body).toEqual({
        error: "Budget not found",
      })
    })
  })

  describe("POST /api/budget/", () => {
    it("creates or updates the authenticated user's budget", async () => {
      authenticate()

      const budget = {
        _id: "budget-1",
        user: "user-1",
        savings: 50000,
        originCurrency: "INR",
        destinationCurrency: "NZD",
      }

      mockBudgetFindOneAndUpdate
        .mockResolvedValue(budget)

      const response = await request(app)
        .post("/api/budget/")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )
        .send({
          savings: 50000,
          originCurrency: "INR",
          destinationCurrency: "NZD",
        })

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        budget,
      })

      expect(
        mockBudgetFindOneAndUpdate
      ).toHaveBeenCalledWith(
        {
          user: "user-1",
        },
        {
          savings: 50000,
          originCurrency: "INR",
          destinationCurrency: "NZD",
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      )
    })

    it("returns 400 when savings is missing", async () => {
      authenticate()

      const response = await request(app)
        .post("/api/budget/")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )
        .send({
          originCurrency: "INR",
          destinationCurrency: "NZD",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Savings and currencies are required",
      })

      expect(
        mockBudgetFindOneAndUpdate
      ).not.toHaveBeenCalled()
    })

    it("returns 400 when a currency is missing", async () => {
      authenticate()

      const response = await request(app)
        .post("/api/budget/")
        .set(
          "Cookie",
          "accessToken=valid-test-token"
        )
        .send({
          savings: 50000,
          originCurrency: "INR",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Savings and currencies are required",
      })

      expect(
        mockBudgetFindOneAndUpdate
      ).not.toHaveBeenCalled()
    })

    it("returns 401 when creating a budget without authentication", async () => {
      const response = await request(app)
        .post("/api/budget/")
        .send({
          savings: 50000,
          originCurrency: "INR",
          destinationCurrency: "NZD",
        })

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(
        mockBudgetFindOneAndUpdate
      ).not.toHaveBeenCalled()
    })
  })
})