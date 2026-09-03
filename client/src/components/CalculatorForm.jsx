import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import CurrencySelector from "./CurrencySelector"
import SavingsInput from "./SavingsInput"

import CalculatorSchema from "../schemas/calculatorSchema"
import { useEffect } from "react"

function CalculatorForm({
  onCalculate,
  onDestinationCurrencyChange,
  exchangeRateError,
  calculationError,
  isCalculating,
  initialBudget
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      originCurrency: "INR",
      destinationCurrency: "NZD",
      savings: ""
    }
  })

  useEffect(() => {
    if (!initialBudget) {
      return
    }

    reset({
      originCurrency: initialBudget.originCurrency,
      destinationCurrency: initialBudget.destinationCurrency,
      savings: String(initialBudget.savings)
    })

    onDestinationCurrencyChange(initialBudget.destinationCurrency)
  }, [initialBudget, reset, onDestinationCurrencyChange])

  return (
    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
      <h2 className="text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-4">
        1. Currency Conversion
      </h2>

      <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="originCurrency"
            control={control}
            render={({ field }) => (
              <CurrencySelector
                name={field.name}
                label="Origin Currency"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="destinationCurrency"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencySelector
                name={field.name}
                label="Destination Currency"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  onDestinationCurrencyChange(value)
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Currency Pair Warning Banner */}
        {errors.destinationCurrency && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.destinationCurrency?.message}</span>
          </div>
        )}

        {/* Savings Input */}
        <SavingsInput
          {...register("savings")}
          label="Total Savings"
          placeholder="1500000.00"
          error={errors.savings?.message}
        />

        {/* Submit Button with Loading Indicator */}
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Calculating...</span>
            </>
          ) : (
            "Calculate Conversion"
          )}
        </button>
      </form>

      {/* API Exchange Rate Error Banner */}
      {exchangeRateError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{exchangeRateError}</span>
        </div>
      )}

      {/* Calculation Error Banner */}
      {calculationError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{calculationError}</span>
        </div>
      )}
    </div>
  )
}
export default CalculatorForm