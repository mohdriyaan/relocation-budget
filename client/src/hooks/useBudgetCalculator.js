import { useState } from "react";

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

      setShowSummary(false)
      setResult(null)

      return false;
    }

    if (value <= 0) {
      setErrors((prev) => ({
        ...prev,
        savings: "Savings should be greater than 0"
      }))

      setShowSummary(false)
      setResult(null)
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

    if (
      name === "savings" ||
      name === "originCurrency" ||
      name === "destinationCurrency"
    ) {
      invalidateCalculation()
    }

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

}