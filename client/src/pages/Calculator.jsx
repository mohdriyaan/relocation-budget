// pages/Calculator.jsx
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import CurrencySelector from "../components/CurrencySelector.jsx"
import SavingsInput from "../components/SavingsInput.jsx"
import { useState } from "react"
import calculateSavings from "../utils/calculateSavings.js"

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

  function checkSavingsError(value) {
    if (value === "") {
      setErrors((prev) => ({
        ...prev,
        savings: "Savings should not be empty"
      }))
      setShowSummary(false)
      return false;
    } else if (value <= 0) {
      setErrors((prev) => ({
        ...prev,
        savings: "Savings should be greater than 0"
      }))
      setShowSummary(false)
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        savings: ""
      }))
      return true
    }
  }

  function checkCurrencyPairError(originCurrency, destinationCurrency) {
    if (originCurrency === destinationCurrency) {
      setErrors((prev) => ({
        ...prev,
        currencyPair: "Same currency selected — no conversion required"
      }))
      setShowSummary(false)
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        currencyPair: ""
      }))
      return true
    }
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

  function handleSubmit(event) {
    event.preventDefault()

    const isSavingsValid = checkSavingsError(formData.savings)
    const isPairValid = checkCurrencyPairError(formData.originCurrency, formData.destinationCurrency)

    if (isSavingsValid && isPairValid) {
      setShowSummary(true)
    }
  }

  function convertAmount(){
    if(formData.originCurrency==="INR" && formData.destinationCurrency==="NZD"){
      return calculateSavings(formData.savings,exchangeRate)
    }
    if(formData.originCurrency===formData.destinationCurrency){
      return formData.savings
    }
    return "Exchange rate unavailable.Please try again."
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
          Exchange Calculator
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {/* Savings Input with Integrated Label & Error Message */}
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 mt-4"
              onClick={()=>setResult(convertAmount())}
            >
              Calculate
            </button>

            {showSummary ? (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <CalculatorSummary
                  originCurrency={formData.originCurrency}
                  destinationCurrency={formData.destinationCurrency}
                  savings={formData.savings}
                  convertedAmount={result}
                />
              </div>
            ) : null}

          </form>
        </div>
      </div>
    </div>
  )
}

export default Calculator