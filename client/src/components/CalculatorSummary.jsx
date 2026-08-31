// components/CalculatorSummary.jsx

const CalculatorSummary = ({
  originCurrency,
  destinationCurrency,
  savings,
  result,
  remainingBudget,
  totalExpenses,
  oneTimeExpenses,
  monthlyExpenses,
  runway,
  rate
}) => {
  const isOverBudget = remainingBudget < 0

  // Format runway text & visual state dynamically
  const getRunwayDisplay = () => {
    if (typeof runway === "number") {
      return {
        text: `${runway.toFixed(1)} months`,
        style: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
      }
    }

    if (runway === "Over Budget" || isOverBudget) {
      return {
        text: "Over Budget",
        style: "text-rose-400 bg-rose-500/10 border-rose-500/30"
      }
    }

    return {
      text: runway || "N/A",
      style: "text-slate-400 bg-slate-900 border-slate-800"
    }
  }

  const runwayDisplay = getRunwayDisplay()

  return (
    <div
      className={`bg-slate-950 rounded-2xl p-6 border shadow-xl text-center space-y-6 transition-colors ${isOverBudget ? "border-rose-500/40" : "border-indigo-500/30"
        }`}
    >
      {/* 1. Conversion Result Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Conversion Result
        </h2>

        <div>
          <span className="text-xs text-slate-400 block mb-1">Savings</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {savings} {originCurrency}
          </p>
        </div>

        <div className="inline-block bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3.5 py-1.5 rounded-full font-mono">
          1 {originCurrency} = {rate} {destinationCurrency}
        </div>

        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Converted Savings</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            ≈ {destinationCurrency} {result}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800"></div>

      {/* 2. Budget Summary Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Budget Summary
        </h2>

        {/* Over-Budget Warning Banner */}
        {isOverBudget && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center justify-center gap-2 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 text-rose-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your estimated expenses exceed your current savings</span>
          </div>
        )}

        {/* 2x2 Grid for Core Budget Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {/* Total Expenses Card */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 mb-1">Total Expenses</span>
            <span className="font-mono text-slate-100 font-bold text-base">
              {destinationCurrency} {totalExpenses}
            </span>
          </div>

          {/* One-Time Costs Card */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 mb-1">One-Time Costs</span>
            <span className="font-mono text-slate-100 font-bold text-base">
              {originCurrency} {oneTimeExpenses}
            </span>
          </div>

          {/* Monthly Living Costs Card */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 mb-1">Monthly Living Costs</span>
            <span className="font-mono text-slate-100 font-bold text-base">
              {originCurrency} {monthlyExpenses}
            </span>
          </div>

          {/* Remaining Budget Card */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${isOverBudget
                ? "bg-rose-500/10 border-rose-500/30"
                : "bg-slate-900 border-slate-800"
              }`}
          >
            <span className="text-xs text-slate-400 mb-1">Remaining Budget</span>
            <span
              className={`font-mono font-bold text-base ${isOverBudget ? "text-rose-400" : "text-emerald-400"
                }`}
            >
              {originCurrency} {remainingBudget}
            </span>
          </div>
        </div>

        {/* Highlighted Estimated Runway Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-colors ${runwayDisplay.style}`}
        >
          <span className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">
            Estimated Runway
          </span>
          <span className="font-mono text-lg sm:text-xl font-bold">
            {runwayDisplay.text}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CalculatorSummary