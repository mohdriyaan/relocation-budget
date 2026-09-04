import currencyList from "../data/currencies.js"

const CurrencySelector = ({
  name,
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-muted"
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
        className={[
          "control-surface",
          "w-full",
          "px-3",
          "py-2.5",
          "text-sm",
          "text-text-primary",
          "transition-colors",
          error ? "border-error!" : "",
        ]
          .filter(Boolean)
          .join(" ")}
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
          className="text-sm leading-5 text-error"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default CurrencySelector