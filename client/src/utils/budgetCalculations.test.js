import { describe, expect, it } from "vitest"

import calculateSavings from "./calculateSavings.js"
import calculateRemainingBudget from "./calculateRemainingBudget.js"
import calculateRunway from "./calculateRunway.js"
import getBudgetStatus from "./getBudgetStatus.js"

describe("budget calculations", () => {
  describe("calculateSavings", () => {
    it("converts savings using the exchange rate", () => {
      expect(calculateSavings(100000, 0.02)).toBe(2000)
    })

    it("returns zero when savings are zero", () => {
      expect(calculateSavings(0, 0.02)).toBe(0)
    })
  })

  describe("calculateRemainingBudget", () => {
    it("calculates remaining budget", () => {
      expect(calculateRemainingBudget(2000, 750)).toBe(1250)
    })

    it("returns a negative value when expenses exceed savings", () => {
      expect(calculateRemainingBudget(500, 750)).toBe(-250)
    })
  })

  describe("calculateRunway", () => {
    it("calculates runway in months", () => {
      expect(calculateRunway(1200, 300)).toBe(4)
    })

    it("handles zero monthly expenses", () => {
      expect(calculateRunway(1200, 0)).toBe("No monthly expenses")
    })

    it("handles an over-budget position", () => {
      expect(calculateRunway(-200, 300)).toBe("Over Budget")
    })
  })

  describe("getBudgetStatus", () => {
    it("returns healthy for a non-negative budget", () => {
      expect(getBudgetStatus(1000)).toEqual({
        key: "healthy",
        label: "Healthy",
      })
    })

    it("returns over-budget for a negative budget", () => {
      expect(getBudgetStatus(-1)).toEqual({
        key: "over-budget",
        label: "Over budget",
      })
    })

    it("returns unknown for an invalid budget", () => {
      expect(getBudgetStatus("not-a-number")).toEqual({
        key: "unknown",
        label: "Unavailable",
      })
    })
  })
})