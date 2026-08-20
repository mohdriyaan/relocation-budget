// components/CalculatorSummary.jsx

const CalculatorSummary = ({ originCurrency, destinationCurrency, savings, result }) => {
  return (
    <div className="bg-slate-950 rounded-2xl p-6 border border-indigo-500/30 shadow-xl text-center space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
        Conversion Result
      </h2>

      <div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tracking-tight">
          ₹{savings} {originCurrency}
        </p>
      </div>

      <div className="inline-block bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3.5 py-1.5 rounded-full font-mono">
        1 {originCurrency} = 0.019 {destinationCurrency}
      </div>

      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
          ≈ {destinationCurrency} {result}
        </p>
      </div>
    </div>
  )
}

export default CalculatorSummary