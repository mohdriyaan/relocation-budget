import { useState } from "react"

import calculateSavings from "../utils/calculateSavings.js"
import calculateTotalExpenses from "../utils/calculateTotalExpenses.js"
import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses.js"
import calculateOneTimeExpenses from "../utils/calculateOneTimeExpenses.js"
import calculateRemainingBudget from "../utils/calculateRemainingBudget.js"
import calculateRunway from "../utils/calculateRunway.js"

import getExchangeRate from "../services/exchangeRateApi.js"
import getExpenseCurrencies from "../utils/getExpenseCurrencies.js"
import getExpenseRates from "../utils/getExpenseRates.js"
import convertExpenses from "../utils/convertExpenses.js"

function useBudgetCalculator(expenses) {
  const [calculationData, setCalculationData] = useState(null)

  const [showSummary, setShowSummary] = useState(false)
  const [result, setResult] = useState(null)

  const [exchangeRate, setExchangeRate] = useState(null)

  const [exchangeRateError, setExchangeRateError] = useState(null)

  const [normalizedExpenses, setNormalizedExpenses] = useState([])
  const [convertedSavings, setConvertedSavings] = useState(null)

  const [calculationError, setCalculationError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  async function normalizeExpenses(expenses, destinationCurrency) {
    const currencies = getExpenseCurrencies(
      expenses,
      destinationCurrency
    )

    const rates = await getExpenseRates(
      currencies,
      destinationCurrency
    )

    return convertExpenses(
      expenses,
      destinationCurrency,
      rates
    )
  }

  function convertAmount(savings, originCurrency, destinationCurrency, rate) {
    const amount = Number(savings)

    if (originCurrency === destinationCurrency) {
      return amount
    }

    return calculateSavings(amount, rate)
  }

  async function fetchRate(from, to) {
    try {
      const result = await getExchangeRate(from, to)
      const rate = result.rate

      setExchangeRate(rate)
      setExchangeRateError(null)

      return rate
    } catch (error) {
      setExchangeRate(null)
      setExchangeRateError("Unable to retrieve exchange rate.")
      throw error
    }
  }

  async function handleSubmit(data) {
    setResult(null)
    setShowSummary(false)
    setCalculationError("")
    setExchangeRateError(null)

    setNormalizedExpenses([])
    setConvertedSavings(null)
    setCalculationData(null)


    setIsCalculating(true)

    try {
      const {
        originCurrency,
        destinationCurrency,
        savings
      } = data

      const convertedExpenses = await normalizeExpenses(
        expenses,
        destinationCurrency
      )

      setNormalizedExpenses(convertedExpenses)

      const rate = await fetchRate(
        originCurrency,
        destinationCurrency
      )

      const convertedAmount = convertAmount(
        savings,
        originCurrency,
        destinationCurrency,
        rate
      )

      setConvertedSavings(convertedAmount)
      setResult(convertedAmount)
      setCalculationData(data)
      setShowSummary(true)
    } catch (error) {
      setCalculationError(
        "Unable to calculate your budget. Please try again."
      )

      setShowSummary(false)
    } finally {
      setIsCalculating(false)
    }
  }

  function invalidateCalculation() {
    setNormalizedExpenses([])
    setConvertedSavings(null)
    setResult(null)
    setCalculationData(null)
    setShowSummary(false)
    setCalculationError("")
  }

  const totalExpenses =
    calculateTotalExpenses(normalizedExpenses)

  const oneTimeExpenses =
    calculateOneTimeExpenses(normalizedExpenses)

  const monthlyExpenses =
    calculateMonthlyExpenses(normalizedExpenses)

  const remainingBudget =
    calculateRemainingBudget(
      convertedSavings,
      totalExpenses
    )

  const runway =
    calculateRunway(
      remainingBudget,
      monthlyExpenses
    )

  return {
    calculationData,
    handleSubmit,
    showSummary,
    result,
    exchangeRate,
    exchangeRateError,
    calculationError,
    totalExpenses,
    oneTimeExpenses,
    monthlyExpenses,
    remainingBudget,
    runway,
    invalidateCalculation,
    isCalculating
  }
}

export default useBudgetCalculator