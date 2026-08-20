// components/CalculatorSummary.jsx

import calculateSavings from "../utils/calculateSavings.js"

const CalculatorSummary = ({ originCurrency, destinationCurrency, savings }) => {
  const savingsInCents = calculateSavings(originCurrency, destinationCurrency, savings)
  const displayAmount = (savingsInCents / 100).toFixed(2)

  // Formats numbers with standard comma separators (e.g., 1500000 -> 1,500,000)
  const formattedSavings = Number(savings)
    ? Number(savings).toLocaleString("en-IN")
    : savings

  const formattedDisplayAmount = Number(displayAmount)
    ? Number(displayAmount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : displayAmount

  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-indigo-500/30 shadow-xl text-center space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
        Conversion Result
      </h2>

      {/* Input Savings Display */}
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tracking-tight">
          ₹{formattedSavings} <span className="text-base text-slate-400 font-normal">{originCurrency}</span>
        </p>
      </div>

      {/* Exchange Rate Subtext / Badge */}
      <div className="inline-block bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full font-mono">
        1 {originCurrency} = 0.019 {destinationCurrency}
      </div>

      {/* Converted Highlight Output */}
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mt-2">
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
          ≈ {destinationCurrency}$ {formattedDisplayAmount}
        </p>
      </div>
    </div>
  )
}

export default CalculatorSummary