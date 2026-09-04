import { useCallback, useEffect, useState } from "react"
import { getExpenses } from "../services/expenseApi.js"
import { getBudget } from "../services/budgetApi.js"
import getExchangeRate from "../services/exchangeRateApi.js"
import getExpenseCurrencies from "../utils/getExpenseCurrencies.js"
import getExpenseRates from "../utils/getExpenseRates.js"
import convertExpenses from "../utils/convertExpenses.js"
import calculateTotalExpenses from "../utils/calculateTotalExpenses.js"

const useDashboardData = () => {
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(null)
  const [convertedSavings, setConvertedSavings] = useState(null)
  const [convertedExpenses, setConvertedExpenses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [convertedExpenseDetails, setConvertedExpenseDetails] = useState([])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      setExpenses([])
      setBudget(null)
      setConvertedSavings(null)
      setConvertedExpenses(null)

      const expenseResult = await getExpenses()
      const dashboardExpenses = expenseResult.expenses

      setExpenses(dashboardExpenses)

      try {
        const budgetResult = await getBudget()
        const dashboardBudget = budgetResult.budget

        setBudget(dashboardBudget)

        let savingsInDestinationCurrency

        if (
          dashboardBudget.originCurrency ===
          dashboardBudget.destinationCurrency
        ) {
          savingsInDestinationCurrency = Number(dashboardBudget.savings)
        } else {
          const rateResult = await getExchangeRate(
            dashboardBudget.originCurrency,
            dashboardBudget.destinationCurrency
          )

          savingsInDestinationCurrency =
            Number(dashboardBudget.savings) * Number(rateResult.rate)
        }

        setConvertedSavings(savingsInDestinationCurrency)

        const currencies = getExpenseCurrencies(
          dashboardExpenses,
          dashboardBudget.destinationCurrency
        )

        const rates = await getExpenseRates(
          currencies,
          dashboardBudget.destinationCurrency
        )

        const convertedExpenses = convertExpenses(
          dashboardExpenses,
          dashboardBudget.destinationCurrency,
          rates
        )

        setConvertedExpenseDetails(convertedExpenses)

        const totalConvertedExpenses =
          calculateTotalExpenses(convertedExpenses)

        setConvertedExpenses(totalConvertedExpenses)
      } catch (error) {
        if (error.message !== "Budget not found") {
          throw error
        }
      }
    } catch (error) {
      setError(error.message || "Unable to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadDashboardData = async() => {
      await fetchDashboardData()
    }

    loadDashboardData()
  }, [fetchDashboardData])

  const remainingBudget =
    convertedSavings !== null && convertedExpenses !== null
      ? convertedSavings - convertedExpenses
      : null

  return {
    expenses,
    budget,
    convertedSavings,
    convertedExpenses,
    remainingBudget,
    loading,
    error,
    fetchDashboardData,
    convertedExpenseDetails
  }
}

export default useDashboardData