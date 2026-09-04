import { forwardRef } from "react"

const SavingsInput = forwardRef(
  ({ label, error, ...inputProps }, ref) => {
    const errorId = `${inputProps.name}-error`

    return (
      <div className="relative w-full">
        <label
          htmlFor={inputProps.name}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>

        <input
          {...inputProps}
          ref={ref}
          id={inputProps.name}
          type="number"
          min="0.01"
          step="0.01"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 ${error
            ? "border-error focus:border-error focus:ring-error/25"
            : "border-input-border focus:border-primary focus:ring-primary/25"
            }`}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-sm text-error"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

SavingsInput.displayName = "SavingsInput"

export default SavingsInput