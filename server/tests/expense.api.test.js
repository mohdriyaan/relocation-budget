import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import request from "supertest"

const {
  mockExpenseFind,
  mockExpenseFindOneAndDelete,
  mockExpenseFindOneAndUpdate,
  mockExpenseSave,
  mockJwtVerify,
} = vi.hoisted(() => ({
  mockExpenseFind: vi.fn(),
  mockExpenseFindOneAndDelete: vi.fn(),
  mockExpenseFindOneAndUpdate: vi.fn(),
  mockExpenseSave: vi.fn(),
  mockJwtVerify: vi.fn(),
}))

vi.mock("../models/Expense.js", () => {
  const Expense = vi.fn(function Expense(data) {
    Object.assign(this, data)
    this.save = mockExpenseSave
  })

  Expense.find = mockExpenseFind
  Expense.findOneAndDelete = mockExpenseFindOneAndDelete
  Expense.findOneAndUpdate = mockExpenseFindOneAndUpdate

  return {
    default: Expense,
  }
})

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}))

import app from "../app.js"

describe("Expense API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const authenticate = () => {
    mockJwtVerify.mockReturnValue({
      id: "user-1",
    })
  }

  const authCookie = "accessToken=valid-test-token"

  describe("GET /api/expenses", () => {
    it("returns the authenticated user's expenses", async () => {
      authenticate()

      const expenses = [
        {
          _id: "expense-1",
          name: "Rent",
          category: "Housing",
          amount: 1500,
          currency: "NZD",
          frequency: "monthly",
          notes: "Initial apartment",
          user: "user-1",
        },
        {
          _id: "expense-2",
          name: "Flight",
          category: "Travel",
          amount: 800,
          currency: "NZD",
          frequency: "one-time",
          notes: "Flight to Auckland",
          user: "user-1",
        },
      ]

      mockExpenseFind.mockResolvedValue(expenses)

      const response = await request(app)
        .get("/api/expenses")
        .set("Cookie", authCookie)

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        expenses,
      })

      expect(mockExpenseFind).toHaveBeenCalledWith({
        user: "user-1",
      })
    })

    it("returns 401 when the access token is missing", async () => {
      const response = await request(app)
        .get("/api/expenses")

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(mockExpenseFind).not.toHaveBeenCalled()
    })

    it("returns 401 when the access token is invalid", async () => {
      mockJwtVerify.mockImplementation(() => {
        throw new Error("Invalid token")
      })

      const response = await request(app)
        .get("/api/expenses")
        .set(
          "Cookie",
          "accessToken=invalid-test-token"
        )

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Invalid / Expired Token",
      })

      expect(mockExpenseFind).not.toHaveBeenCalled()
    })
  })

  describe("POST /api/expenses", () => {
    it("creates an expense for the authenticated user", async () => {
      authenticate()

      const savedExpense = {
        _id: "expense-1",
        name: "Rent",
        category: "Housing",
        amount: 1500,
        currency: "NZD",
        frequency: "monthly",
        notes: "Initial apartment",
        user: "user-1",
      }

      mockExpenseSave.mockResolvedValue(savedExpense)

      const response = await request(app)
        .post("/api/expenses")
        .set("Cookie", authCookie)
        .send({
          name: "Rent",
          category: "Housing",
          amount: 1500,
          currency: "NZD",
          frequency: "monthly",
          notes: "Initial apartment",
        })

      expect(response.status).toBe(201)

      expect(response.body).toEqual({
        expense: savedExpense,
      })

      expect(mockExpenseSave).toHaveBeenCalledOnce()
    })

    it("associates the new expense with the authenticated user", async () => {
      authenticate()

      mockExpenseSave.mockResolvedValue({
        _id: "expense-1",
        name: "Rent",
        category: "Housing",
        amount: 1500,
        currency: "NZD",
        frequency: "monthly",
        user: "user-1",
      })

      await request(app)
        .post("/api/expenses")
        .set("Cookie", authCookie)
        .send({
          name: "Rent",
          category: "Housing",
          amount: 1500,
          currency: "NZD",
          frequency: "monthly",
        })

      const createdExpense =
        mockExpenseSave.mock.instances[0]

      expect(createdExpense.user).toBe("user-1")
    })

    it("returns 400 when the model reports validation errors", async () => {
      authenticate()

      mockExpenseSave.mockRejectedValue({
        name: "ValidationError",
      })

      const response = await request(app)
        .post("/api/expenses")
        .set("Cookie", authCookie)
        .send({
          name: "",
          category: "",
          amount: 0,
          currency: "INVALID",
          frequency: "invalid",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Invalid inputs",
      })
    })

    it("returns 401 when creating an expense without authentication", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({
          name: "Rent",
          category: "Housing",
          amount: 1500,
          currency: "NZD",
          frequency: "monthly",
        })

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(mockExpenseSave).not.toHaveBeenCalled()
    })
  })

  describe("PATCH /api/expenses/:id", () => {
    it("updates an expense belonging to the authenticated user", async () => {
      authenticate()

      const updatedExpense = {
        _id: "expense-1",
        name: "Updated Rent",
        category: "Housing",
        amount: 1600,
        currency: "NZD",
        frequency: "monthly",
        notes: "Updated amount",
        user: "user-1",
      }

      mockExpenseFindOneAndUpdate
        .mockResolvedValue(updatedExpense)

      const response = await request(app)
        .patch("/api/expenses/expense-1")
        .set("Cookie", authCookie)
        .send({
          name: "Updated Rent",
          category: "Housing",
          amount: 1600,
          currency: "NZD",
          frequency: "monthly",
          notes: "Updated amount",
        })

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        expense: updatedExpense,
      })

      expect(
        mockExpenseFindOneAndUpdate
      ).toHaveBeenCalledWith(
        {
          _id: "expense-1",
          user: "user-1",
        },
        {
          name: "Updated Rent",
          category: "Housing",
          amount: 1600,
          currency: "NZD",
          frequency: "monthly",
          notes: "Updated amount",
        },
        {
          new: true,
          runValidators: true,
        }
      )
    })

    it("returns 404 when the expense does not belong to the user", async () => {
      authenticate()

      mockExpenseFindOneAndUpdate
        .mockResolvedValue(null)

      const response = await request(app)
        .patch("/api/expenses/expense-1")
        .set("Cookie", authCookie)
        .send({
          name: "Updated Rent",
          category: "Housing",
          amount: 1600,
          currency: "NZD",
          frequency: "monthly",
        })

      expect(response.status).toBe(404)

      expect(response.body).toEqual({
        error: "Valid ID but expense not found",
      })
    })

    it("returns 400 for validation errors during update", async () => {
      authenticate()

      mockExpenseFindOneAndUpdate
        .mockRejectedValue({
          name: "ValidationError",
        })

      const response = await request(app)
        .patch("/api/expenses/expense-1")
        .set("Cookie", authCookie)
        .send({
          name: "",
          category: "",
          amount: -10,
          currency: "INVALID",
          frequency: "invalid",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Invalid inputs",
      })
    })

    it("returns 400 for an invalid expense id", async () => {
      authenticate()

      mockExpenseFindOneAndUpdate
        .mockRejectedValue({
          name: "CastError",
        })

      const response = await request(app)
        .patch("/api/expenses/not-a-valid-id")
        .set("Cookie", authCookie)
        .send({
          name: "Updated Rent",
          category: "Housing",
          amount: 1600,
          currency: "NZD",
          frequency: "monthly",
        })

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Invalid Id format",
      })
    })

    it("returns 401 when updating without authentication", async () => {
      const response = await request(app)
        .patch("/api/expenses/expense-1")
        .send({
          name: "Updated Rent",
          category: "Housing",
          amount: 1600,
          currency: "NZD",
          frequency: "monthly",
        })

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(
        mockExpenseFindOneAndUpdate
      ).not.toHaveBeenCalled()
    })
  })

  describe("DELETE /api/expenses/:id", () => {
    it("deletes an expense belonging to the authenticated user", async () => {
      authenticate()

      mockExpenseFindOneAndDelete.mockResolvedValue({
        _id: "expense-1",
        user: "user-1",
      })

      const response = await request(app)
        .delete("/api/expenses/expense-1")
        .set("Cookie", authCookie)

      expect(response.status).toBe(200)

      expect(response.body).toEqual({
        message: "Expense has been deleted successfully",
      })

      expect(
        mockExpenseFindOneAndDelete
      ).toHaveBeenCalledWith({
        _id: "expense-1",
        user: "user-1",
      })
    })

    it("returns 404 when the expense does not belong to the user", async () => {
      authenticate()

      mockExpenseFindOneAndDelete
        .mockResolvedValue(null)

      const response = await request(app)
        .delete("/api/expenses/expense-1")
        .set("Cookie", authCookie)

      expect(response.status).toBe(404)

      expect(response.body).toEqual({
        error: "Valid ID but expense not found",
      })
    })

    it("returns 400 for an invalid expense id", async () => {
      authenticate()

      mockExpenseFindOneAndDelete
        .mockRejectedValue({
          name: "CastError",
        })

      const response = await request(app)
        .delete("/api/expenses/not-a-valid-id")
        .set("Cookie", authCookie)

      expect(response.status).toBe(400)

      expect(response.body).toEqual({
        error: "Invalid Id format",
      })
    })

    it("returns 401 when deleting without authentication", async () => {
      const response = await request(app)
        .delete("/api/expenses/expense-1")

      expect(response.status).toBe(401)

      expect(response.body).toEqual({
        error: "Authentication required",
      })

      expect(
        mockExpenseFindOneAndDelete
      ).not.toHaveBeenCalled()
    })
  })
})