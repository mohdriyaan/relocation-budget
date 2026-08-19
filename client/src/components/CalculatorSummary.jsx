// components/CalculatorSummary.jsx
const CalculatorSummary = ({originCurrency, destinationCurrency, savings}) => {
  return (
    <div className="bg-slate-950 rounded-xl p-5 border border-indigo-500/30 shadow-inner">
      <h2 className="text-lg font-semibold text-indigo-400 mb-4 tracking-wide">
        Calculation Input
      </h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400">From:</span>
          <span className="font-mono text-white font-medium">{originCurrency}</span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400">To:</span>
          <span className="font-mono text-white font-medium">{destinationCurrency}</span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400">Savings:</span>
          <span className="font-mono text-white font-medium">{savings}</span>
        </div>
      </div>
    </div>
  )
}
export default CalculatorSummary