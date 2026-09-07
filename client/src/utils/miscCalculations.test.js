import { beforeEach, describe, expect, it, vi } from "vitest"

import formatCurrency from "./formatCurrency.js"
import getExpenseRates from "./getExpenseRates.js"

import getExchangeRate from "../services/exchangeRateApi.js"

vi.mock("../services/exchangeRateApi.js", () => ({
  default: vi.fn(),
}))

describe("utility calculations", () => {
  describe("formatCurrency", () => {
    it("formats a number with two decimal places", () => {
      expect(formatCurrency(1234.5)).toBe("1,234.50")
    })

    it("formats a large number with separators", () => {
      expect(formatCurrency(1234567.89)).toBe("1,234,567.89")
    })

    it("returns zero formatting for a zero value", () => {
      expect(formatCurrency(0)).toBe("0.00")
    })

    it("falls back to zero for a falsy value", () => {
      expect(formatCurrency("")).toBe("0.00")
    })
  })

  describe("getExpenseRates", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it("fetches rates for each currency and returns a lookup object", async () => {
      getExchangeRate
        .mockResolvedValueOnce({ rate: 0.02 })
        .mockResolvedValueOnce({ rate: 0.016 })

      const result = await getExpenseRates(
        ["INR", "USD"],
        "NZD"
      )

      expect(result).toEqual({
        INR: 0.02,
        USD: 0.016,
      })

      expect(getExchangeRate).toHaveBeenCalledTimes(2)
      expect(getExchangeRate).toHaveBeenNthCalledWith(
        1,
        "INR",
        "NZD"
      )
      expect(getExchangeRate).toHaveBeenNthCalledWith(
        2,
        "USD",
        "NZD"
      )
    })

    it("returns an empty object when no currencies are provided", async () => {
      const result = await getExpenseRates([], "NZD")

      expect(result).toEqual({})
      expect(getExchangeRate).not.toHaveBeenCalled()
    })
  })
})