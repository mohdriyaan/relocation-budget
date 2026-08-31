import { useState } from "react";
import calculateSavings from "../utils/calculateSavings.js";
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
  const [formData, setFormData] = useState({
    originCurrency: "INR",
    destinationCurrency: "NZD",
    savings: ""
  })

  const [errors, setErrors] = useState({
    savings: "",
    currencyPair: ""
  })

  const [showSummary, setShowSummary] = useState(false)
  const [result, setResult] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)
  const [isRateLoading, setIsRateLoading] = useState(false)
  const [exchangeRateError, setExchangeRateError] = useState(null)
  const [normalizedExpenses, setNormalizedExpenses] = useState([])
  const [convertedSavings, setConvertedSavings] = useState(null)
  const [calculationError, setCalculationError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  function checkSavingsError(value) {
    if (value === "") {
      setErrors((prev) => ({
        ...prev,
        savings: "Savings should not be empty"
      }))
      return false;
    }

    if (value <= 0) {
      setErrors((prev) => ({
        ...prev,
        savings: "Savings should be greater than 0"
      }))

      return false;
    }

    setErrors((prev) => ({
      ...prev,
      savings: ""
    }))
    return true
  }

  function checkCurrencyPairError(originCurrency, destinationCurrency) {
    if (originCurrency === destinationCurrency) {
      setErrors((prev) => ({
        ...prev,
        currencyPair: "Same currency selected — no conversion required"
      }))
      return false
    }

    setErrors((prev) => ({
      ...prev,
      currencyPair: ""
    }))
    return true
  }

  function changeHandler(event) {
    const { name, value } = event.target

    if (name === "savings") {
      checkSavingsError(value)
    }

    if (name === "originCurrency") {
      checkCurrencyPairError(value, formData.destinationCurrency)
    }

    if (name === "destinationCurrency") {
      checkCurrencyPairError(formData.originCurrency, value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function convertAmount(rate) {
    const amount = Number(formData.savings)

    if (formData.originCurrency === formData.destinationCurrency) {
      return amount
    }

    return calculateSavings(amount, rate)

  }

  async function normalizeExpenses(expenses, destinationCurrency) {
    const currencies = getExpenseCurrencies(expenses, destinationCurrency)

    const rates = await getExpenseRates(currencies, destinationCurrency)

    return convertExpenses(expenses, destinationCurrency, rates)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    // invalidating previous results & errors
    setResult(null)
    setShowSummary(false)
    setCalculationError("")

    const isSavingsValid = checkSavingsError(formData.savings)
    const isPairValid = checkCurrencyPairError(formData.originCurrency, formData.destinationCurrency)

    if (!isSavingsValid || !isPairValid) {
      return;
    }

    setIsCalculating(true)

    try {
      const convertedExpenses = await normalizeExpenses(expenses, formData.destinationCurrency)

      setNormalizedExpenses(convertedExpenses)

      const rate = await fetchRate(formData.originCurrency, formData.destinationCurrency)

      const convertedAmount = convertAmount(rate)

      setConvertedSavings(convertedAmount)
      setResult(convertedAmount)
      setShowSummary(true)
    } catch (error) {
      setCalculationError("Unable to calculate your budget. Please try again.")
      setShowSummary(false)
    } finally {
      setIsCalculating(false)
    }
  }

  async function fetchRate(from, to) {
    try {
      setIsRateLoading(true)

      const result = await getExchangeRate(from, to)
      const rate = result.rate

      setExchangeRate(rate)
      setExchangeRateError(null)

      return rate

    } catch (error) {
      setExchangeRateError("Unable to retrieve exchange rate.")
      throw error
    } finally {
      setIsRateLoading(false)
    }
  }

  function invalidateCalculation() {
    setNormalizedExpenses([])
    setConvertedSavings(null)
    setResult(null)
    setShowSummary(false)
    setCalculationError("")
  }

  const totalExpenses = calculateTotalExpenses(normalizedExpenses)
  const oneTimeExpenses = calculateOneTimeExpenses(normalizedExpenses)
  const monthlyExpenses = calculateMonthlyExpenses(normalizedExpenses)
  const remainingBudget = calculateRemainingBudget(convertedSavings, totalExpenses)
  const runway = calculateRunway(remainingBudget, monthlyExpenses)

  return {
    formData,
    errors,
    changeHandler,
    handleSubmit,
    showSummary,
    result,
    exchangeRate,
    isRateLoading,
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