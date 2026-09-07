import { describe, expect, it } from "vitest"

import calculateTotalExpenses from "./calculateTotalExpenses.js"
import calculateOneTimeExpenses from "./calculateOneTimeExpenses.js"
import calculateMonthlyExpenses from "./calculateMonthlyExpenses.js"

describe("expense calculations", () => {
  it("calculates total expenses", () => {
    const expenses = [
      { amount: 100, frequency: "one-time" },
      { amount: 50, frequency: "monthly" },
      { amount: 25, frequency: "one-time" },
    ]

    expect(calculateTotalExpenses(expenses)).toBe(175)
  })

  it("returns zero for an empty expense list", () => {
    expect(calculateTotalExpenses([])).toBe(0)
  })

  it("calculates only one-time expenses", () => {
    const expenses = [
      { amount: 100, frequency: "one-time" },
      { amount: 50, frequency: "monthly" },
      { amount: 25, frequency: "one-time" },
    ]

    expect(calculateOneTimeExpenses(expenses)).toBe(125)
  })

  it("calculates only monthly expenses", () => {
    const expenses = [
      { amount: 100, frequency: "one-time" },
      { amount: 50, frequency: "monthly" },
      { amount: 25, frequency: "monthly" },
    ]

    expect(calculateMonthlyExpenses(expenses)).toBe(75)
  })
})