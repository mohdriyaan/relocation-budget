import { describe, expect, it, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"

import useDashboardData from "./useDashboardData.js"

import { getExpenses } from "../services/expenseApi.js"
import { getBudget } from "../services/budgetApi.js"
import getExchangeRate from "../services/exchangeRateApi.js"
import getExpenseCurrencies from "../utils/getExpenseCurrencies.js"
import getExpenseRates from "../utils/getExpenseRates.js"
import convertExpenses from "../utils/convertExpenses.js"
import calculateTotalExpenses from "../utils/calculateTotalExpenses.js"

vi.mock("../services/expenseApi.js", () => ({
  getExpenses: vi.fn(),
}))

vi.mock("../services/budgetApi.js", () => ({
  getBudget: vi.fn(),
}))

vi.mock("../services/exchangeRateApi.js", () => ({
  default: vi.fn(),
}))

vi.mock("../utils/getExpenseCurrencies.js", () => ({
  default: vi.fn(),
}))

vi.mock("../utils/getExpenseRates.js", () => ({
  default: vi.fn(),
}))

vi.mock("../utils/convertExpenses.js", () => ({
  default: vi.fn(),
}))

vi.mock("../utils/calculateTotalExpenses.js", () => ({
  default: vi.fn(),
}))

describe("useDashboardData", () => {
  const expenses = [
    {
      _id: "expense-1",
      name: "Flight",
      amount: 50000,
      currency: "INR",
      category: "Travel",
      frequency: "one-time",
    },
    {
      _id: "expense-2",
      name: "Rent",
      amount: 1000,
      currency: "NZD",
      category: "Housing",
      frequency: "monthly",
    },
  ]

  const budget = {
    originCurrency: "INR",
    destinationCurrency: "NZD",
    savings: 1500000,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    getExpenses.mockResolvedValue({
      expenses,
    })

    getBudget.mockResolvedValue({
      budget,
    })

    getExchangeRate.mockResolvedValue({
      rate: 0.0205,
    })

    getExpenseCurrencies.mockReturnValue(["INR", "NZD"])

    getExpenseRates.mockResolvedValue({
      INR: 0.0205,
      NZD: 1,
    })

    convertExpenses.mockReturnValue([
      {
        ...expenses[0],
        amount: 1025,
      },
      {
        ...expenses[1],
        amount: 1000,
      },
    ])

    calculateTotalExpenses.mockReturnValue(2025)
  })

  it("loads and calculates dashboard data successfully", async () => {
    const { result } = renderHook(() => useDashboardData())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.expenses).toEqual(expenses)
    expect(result.current.budget).toEqual(budget)
    expect(result.current.convertedSavings).toBe(30750)
    expect(result.current.convertedExpenses).toBe(2025)
    expect(result.current.remainingBudget).toBe(28725)
    expect(result.current.convertedExpenseDetails).toHaveLength(2)

    expect(getExpenses).toHaveBeenCalledTimes(1)
    expect(getBudget).toHaveBeenCalledTimes(1)
    expect(getExchangeRate).toHaveBeenCalledWith("INR", "NZD")
    expect(getExpenseCurrencies).toHaveBeenCalledWith(
      expenses,
      "NZD"
    )
    expect(getExpenseRates).toHaveBeenCalledWith(
      ["INR", "NZD"],
      "NZD"
    )
    expect(convertExpenses).toHaveBeenCalled()
    expect(calculateTotalExpenses).toHaveBeenCalled()
  })

  it("does not request an exchange rate when currencies match", async () => {
    getBudget.mockResolvedValue({
      budget: {
        originCurrency: "NZD",
        destinationCurrency: "NZD",
        savings: 1500000,
      },
    })

    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.convertedSavings).toBe(1500000)
    expect(getExchangeRate).not.toHaveBeenCalled()
  })

  it("handles a missing budget without treating it as an error", async () => {
    getBudget.mockRejectedValue(
      new Error("Budget not found")
    )

    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.budget).toBeNull()
    expect(result.current.convertedSavings).toBeNull()
    expect(result.current.convertedExpenses).toBeNull()
  })

  it("handles expense loading errors", async () => {
    getExpenses.mockRejectedValue(
      new Error("Unable to load expenses")
    )

    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(
      "Unable to load expenses"
    )
    expect(result.current.expenses).toEqual([])
    expect(result.current.budget).toBeNull()
  })

  it("handles exchange rate errors", async () => {
    getExchangeRate.mockRejectedValue(
      new Error("Exchange rate unavailable")
    )

    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(
      "Exchange rate unavailable"
    )
  })

  it("refetches dashboard data when fetchDashboardData is called", async () => {
    const { result } = renderHook(() => useDashboardData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(getExpenses).toHaveBeenCalledTimes(1)
    expect(getBudget).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.fetchDashboardData()
    })

    expect(getExpenses).toHaveBeenCalledTimes(2)
    expect(getBudget).toHaveBeenCalledTimes(2)
  })
})