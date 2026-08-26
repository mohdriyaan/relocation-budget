// pages/Calculator.jsx
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import CurrencySelector from "../components/CurrencySelector.jsx"
import SavingsInput from "../components/SavingsInput.jsx"
import { useState } from "react"
import calculateSavings from "../utils/calculateSavings.js"
import ExpenseForm from "../components/ExpenseForm.jsx"
import ExpenseList from "../components/ExpenseList.jsx"
import calculateTotalExpenses from "../utils/calculateTotalExpenses.js"
import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses.js"
import calculateOneTimeExpenses from "../utils/calculateOneTimeExpenses.js"
import calculateRemainingBudget from "../utils/calculateRemainingBudget.js"
import calculateRunway from "../utils/calculateRunway.js"
import { useEffect } from "react"
import getExchangeRate from "../services/exchangeRateApi.js"

const Calculator = () => {
  const [showSummary, setShowSummary] = useState(false)

  const exchangeRate = 0.019

  const [formData, setFormData] = useState({
    originCurrency: "INR",
    destinationCurrency: "NZD",
    savings: ""
  })

  const [errors, setErrors] = useState({
    savings: "",
    currencyPair: ""
  })

  const [result, setResult] = useState(null)

  const [expenses, setExpenses] = useState([])

  const [exchangeRateData, setExchangeRateData] = useState(null)

  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    fetchRate(formData.originCurrency, formData.destinationCurrency)
  },[formData.originCurrency,formData.destinationCurrency])

  async function fetchRate(from,to){
    try {
      setLoading(true)
      const result = await getExchangeRate(from,to)
      
      if(result){
        setExchangeRateData(result.rate)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }   
  }

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

  function convertAmount() {
    const amount = Number(formData.savings)

    if (formData.originCurrency === formData.destinationCurrency) {
      return amount
    }

    if (formData.originCurrency === "INR" && formData.destinationCurrency === "NZD") {
      return calculateSavings(amount, exchangeRate)
    }

    return null
  }

  function addExpense(expenseData) {
    const newExpense = {
      id: crypto.randomUUID(),
      ...expenseData
    }

    setExpenses((prevExpenses) => [
      ...prevExpenses,
      newExpense
    ])
  }

  function deleteExpense(idToDelete) {
    setExpenses((prevExpenses) => (
      prevExpenses.filter(
        (expense) => expense.id !== idToDelete
      )
    ))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const isSavingsValid = checkSavingsError(formData.savings)

    if (!isSavingsValid) {
      return;
    }

    const convertedAmount = convertAmount()

    if (convertedAmount === null) {
      setResult(null)
      setShowSummary(false)
      return;
    }

    setResult(convertedAmount)
    setShowSummary(true)
  }

  const totalExpenses = calculateTotalExpenses(expenses)
  const oneTimeExpenses = calculateOneTimeExpenses(expenses)
  const monthlyExpenses = calculateMonthlyExpenses(expenses)
  const remainingBudget = calculateRemainingBudget(formData.savings,totalExpenses)
  const runway = calculateRunway(remainingBudget, monthlyExpenses)

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exchange & Budget Calculator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Convert currency savings and track upcoming trip or relocation expenses in one place.
          </p>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Currency Conversion Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-4">
              1. Currency Conversion
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencySelector
                  name="originCurrency"
                  label="Origin Currency"
                  value={formData.originCurrency}
                  onChange={changeHandler}
                />
                <CurrencySelector
                  name="destinationCurrency"
                  label="Destination Currency"
                  value={formData.destinationCurrency}
                  onChange={changeHandler}
                />
              </div>

              {/* Currency Pair Warning Banner */}
              {errors.currencyPair && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.currencyPair}</span>
                </div>
              )}

              {/* Savings Input */}
              <SavingsInput
                label="Total Savings"
                name="savings"
                onChange={changeHandler}
                placeholder="1500000.00"
                value={formData.savings}
                error={errors.savings}
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Calculate Conversion
              </button>
            </form>

            {/* Conversion Summary Output */}
            {showSummary && result !== null && (
              <div className="pt-6 border-t border-slate-800">
                <CalculatorSummary
                  originCurrency={formData.originCurrency}
                  destinationCurrency={formData.destinationCurrency}
                  savings={formData.savings}
                  result={result}
                  totalExpenses={totalExpenses}
                  remainingBudget={remainingBudget}
                  oneTimeExpenses={oneTimeExpenses}
                  monthlyExpenses={monthlyExpenses}
                  runway={runway}
                />
              </div>
            )}
          </div>

          {/* Right Column: Expense Management */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Add Expense Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-4">
                2. Add Expense
              </h2>
              <ExpenseForm addExpense={addExpense} />
            </div>

            {/* Expense List Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Planned Expenses
                </h2>
                <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                  Total Items: {expenses.length}
                </span>
              </div>
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Calculator