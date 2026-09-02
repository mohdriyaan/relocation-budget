import { forwardRef } from "react"

const SavingsInput = forwardRef(
  ({ label, error, ...inputProps }, ref) => {
    const errorId = `${inputProps.name}-error`

    return (
      <div className="relative w-full">
        <label
          htmlFor={inputProps.name}
          className="block text-sm font-medium text-slate-300 mb-2"
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
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-slate-950 text-white text-sm rounded-lg block p-3 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
              : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-xs sm:text-sm text-rose-400 flex items-center gap-1.5 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 01-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>

            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }
)

SavingsInput.displayName = "SavingsInput"

export default SavingsInput