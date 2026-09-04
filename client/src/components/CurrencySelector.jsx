import currencyList from "../data/currencies.js"

const CurrencySelector = ({
  name,
  label,
  value,
  onChange,
  error,
}) => {
  const selectClassName = error
    ? "border-error focus:border-error focus:ring-error/25"
    : "border-input-border focus:border-primary focus:ring-primary/25"

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary"
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
        className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 ${selectClassName}`}
      >
        {currencyList.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-error"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default CurrencySelector