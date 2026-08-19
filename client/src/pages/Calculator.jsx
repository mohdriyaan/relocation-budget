// pages/Calculator.jsx
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import CurrencySelector from "../components/CurrencySelector.jsx"
import SavingsInput from "../components/SavingsInput.jsx"
import { useState } from "react"

const Calculator = () => {
  const [showSummary, setShowSummary] = useState(false)
  
  const [formData, setFormData] = useState({
    originCurrency: "INR",
    destinationCurrency: "NZD",
    savings: ""
  })

  function changeHandler(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setShowSummary(true)
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Savings
              </label>
              <SavingsInput 
                name="savings" 
                onChange={changeHandler} 
                placeholder="1500000" 
                value={formData.savings} 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 mt-4"
            >
              Calculate
            </button>

            {showSummary ? (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <CalculatorSummary 
                  originCurrency={formData.originCurrency} 
                  destinationCurrency={formData.destinationCurrency} 
                  savings={formData.savings} 
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