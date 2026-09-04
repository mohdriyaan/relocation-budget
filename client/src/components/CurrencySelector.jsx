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
          "w-full",
          "rounded-lg",
          "border",
          "bg-white/2",
          "px-3",
          "py-2.5",
          "text-sm",
          "text-text-primary",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
          "transition-colors",
          "focus:outline-none",
          "focus-visible:outline-none",
          "focus-visible:ring-1",
          "focus-visible:ring-white/20",
          "focus-visible:ring-offset-2",
          "color-scheme-dark",
          "focus-visible:ring-offset-background",
          error
            ? "border-error focus-visible:border-error"
            : "border-white/10 focus-visible:border-white/20",
        ].join(" ")}
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