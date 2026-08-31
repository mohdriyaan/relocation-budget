import { useState } from "react";
import calculateSavings from "../utils/calculateSavings.js";
import getExpenseCurrencies from "../utils/getExpenseCurrencies.js";
import getExpenseRates from "../utils/getExpenseRates.js";
import convertExpenses from "../utils/convertExpenses.js";

function useBudgetCalculator() {
  const [formData, setFormData] = useState({
    originCurrency: "INR",
    destinationCurrency: "NZD",
    savings: ""
  })

  const [errors, setErrors] = useState({
    savings: "",
    currencyPair: ""
  })

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

    const normalizedExpenses = convertExpenses(expenses, destinationCurrency, rates)

    return normalizedExpenses
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

  return {
    formData,
    errors,
    changeHandler,
    checkSavingsError,
    checkCurrencyPairError,
    convertAmount,
    normalizeExpenses,
    handleSubmit,
    fetchRate
  }

}

export default useBudgetCalculator