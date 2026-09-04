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
  initialBudget,
  hasCalculated
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
    <section className="rounded-xl border border-divider bg-surface p-6 sm:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Calculate your relocation budget
        </h1>

        <p className="max-w-xl text-sm leading-6 text-text-muted">
          Convert your savings into your destination currency and see how much
          remains after planned expenses.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onCalculate)}
        noValidate
        className="mt-7 space-y-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            name="originCurrency"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencySelector
                name={field.name}
                label="Origin currency"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="destinationCurrency"
            control={control}
            render={({ field, fieldState }) => (
              <CurrencySelector
                name={field.name}
                label="Destination currency"
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

        <SavingsInput
          {...register("savings")}
          label="Total savings"
          placeholder="1500000.00"
          error={errors.savings?.message}
        />

        {!isCalculating && !calculationError && !hasCalculated && (
          <p className="text-sm text-text-muted">
            Enter your savings and destination currency to see your budget
            position.
          </p>
        )}

        <button
          type="submit"
          disabled={isCalculating}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCalculating ? "Calculating..." : "Calculate budget"}
        </button>
      </form>

      {exchangeRateError && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {exchangeRateError}
        </div>
      )}

      {calculationError && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {calculationError}
        </div>
      )}
    </section>
  )
}
export default CalculatorForm