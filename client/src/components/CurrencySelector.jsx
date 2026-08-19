// components/CurrencySelector.jsx
import currencyList from "../data/currencies.js"

const CurrencySelector = ({name, label, value, onChange}) => {
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
        className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 appearance-none transition-colors"
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  )
}
export default CurrencySelector