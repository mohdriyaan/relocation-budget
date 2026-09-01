// components/CurrencySelector.jsx
import currencyList from "../data/currencies.js"

const CurrencySelector = ({ name, label, value, onChange, error }) => {
  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>

      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 ${error
          ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
          : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>

      {error && (
        <span
          id={`${name}-error`}
          role="alert"
          className="mt-2 text-xs sm:text-sm text-rose-400 font-medium"
        >
          {error}
        </span>
      )}
    </div>
  )
}
export default CurrencySelector