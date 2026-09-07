import { describe, expect, it } from "vitest"

import convertExpenseAmount from "./convertExpenseAmount.js"
import convertExpenses from "./convertExpenses.js"
import getExpenseCurrencies from "./getExpenseCurrencies.js"

describe("currency calculations", () => {
  describe("convertExpenseAmount", () => {
    it("returns the original amount for the same currency", () => {
      expect(
        convertExpenseAmount(500, "NZD", "NZD", 0.02)
      ).toBe(500)
    })

    it("converts an amount using the exchange rate", () => {
      expect(
        convertExpenseAmount(1000, "INR", "NZD", 0.02)
      ).toBe(20)
    })
  })

  describe("convertExpenses", () => {
    it("converts expenses and normalizes their currency", () => {
      const expenses = [
        {
          id: 1,
          name: "Flight",
          amount: 1000,
          currency: "INR",
        },
        {
          id: 2,
          name: "Rent",
          amount: 500,
          currency: "NZD",
        },
      ]

      const rates = {
        INR: 0.02,
        NZD: 1,
      }

      expect(
        convertExpenses(expenses, "NZD", rates)
      ).toEqual([
        {
          id: 1,
          name: "Flight",
          amount: 20,
          currency: "NZD",
        },
        {
          id: 2,
          name: "Rent",
          amount: 500,
          currency: "NZD",
        },
      ])
    })

    it("preserves the remaining expense properties", () => {
      const expenses = [
        {
          id: 1,
          name: "Flight",
          amount: 1000,
          currency: "INR",
          frequency: "one-time",
        },
      ]

      const rates = {
        INR: 0.02,
      }

      expect(
        convertExpenses(expenses, "NZD", rates)[0]
      ).toEqual({
        id: 1,
        name: "Flight",
        amount: 20,
        currency: "NZD",
        frequency: "one-time",
      })
    })
  })

  describe("getExpenseCurrencies", () => {
    it("returns unique currencies that differ from the destination", () => {
      const expenses = [
        { amount: 100, currency: "INR" },
        { amount: 200, currency: "USD" },
        { amount: 300, currency: "INR" },
        { amount: 400, currency: "NZD" },
      ]

      expect(
        getExpenseCurrencies(expenses, "NZD")
      ).toEqual(["INR", "USD"])
    })

    it("returns an empty array when all expenses already use the destination currency", () => {
      const expenses = [
        { amount: 100, currency: "NZD" },
        { amount: 200, currency: "NZD" },
      ]

      expect(
        getExpenseCurrencies(expenses, "NZD")
      ).toEqual([])
    })
  })
})