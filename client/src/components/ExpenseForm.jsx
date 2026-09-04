import { useEffect, useState } from "react"
import expenseCategories from "../data/expenseCategories.js"
import CurrencySelector from "./CurrencySelector.jsx"
import { createExpense, updateExpense } from "../services/expenseApi.js"
import ExpenseSchema from "../schemas/expenseSchema.js"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const ExpenseForm = ({
  addExpense,
  destinationCurrency,
  editingExpense,
  onUpdateExpense,
  onEditComplete,
  onCancelEdit,
}) => {
  const getDefaultExpenseValues = (currency) => ({
    name: "",
    category: "Other",
    amount: "",
    currency: currency || "NZD",
    frequency: "one-time",
    notes: "",
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: getDefaultExpenseValues(destinationCurrency),
  })

  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    if (!editingExpense) {
      return
    }

    reset({
      name: editingExpense.name,
      category: editingExpense.category,
      amount: editingExpense.amount,
      currency: editingExpense.currency || destinationCurrency,
      frequency: editingExpense.frequency,
      notes: editingExpense.notes ?? "",
    })
  }, [editingExpense, destinationCurrency, reset])

  function resetForm() {
    reset(getDefaultExpenseValues(destinationCurrency))
    setSubmitError("")
  }

  function handleCancel() {
    resetForm()
    onCancelEdit()
  }

  async function submitHandler(data) {
    try {
      setSubmitError("")

      const result = editingExpense
        ? await updateExpense(editingExpense._id, data)
        : await createExpense(data)

      if (result.expense) {
        if (editingExpense) {
          onUpdateExpense(result.expense)
          onEditComplete()
        } else {
          addExpense(result.expense)
        }

        resetForm()
      }
    } catch (error) {
      setSubmitError(
        error.message || "Unable to save expense. Please try again."
      )
    }
  }

  const inputClassName = (hasError) =>
    `w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 ${
      hasError
        ? "border-error focus:border-error focus:ring-error/25"
        : "border-input-border focus:border-primary focus:ring-primary/25"
    }`

  const selectClassName = (hasError) =>
    `w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 ${
      hasError
        ? "border-error focus:border-error focus:ring-error/25"
        : "border-input-border focus:border-primary focus:ring-primary/25"
    }`

  return (
    <form 
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      className="space-y-5"
    >
      {/* Edit mode */}
      {editingExpense !== null && (
        <div className="flex flex-col gap-3 rounded-lg border border-information/35 bg-information/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-text-primary">
            Editing expense:{" "}
            <span className="font-semibold">{editingExpense.name}</span>
          </p>

          <button
            type="button"
            onClick={handleCancel}
            className="w-fit text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-primary"
          >
            Expense name
          </label>

          <input
            {...register("name")}
            id="name"
            type="text"
            autoComplete="off"
            placeholder="e.g. Flight ticket"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClassName(Boolean(errors.name))}
          />

          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-error">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-text-primary"
          >
            Category
          </label>

          <select
            {...register("category")}
            id="category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "category-error" : undefined
            }
            className={selectClassName(Boolean(errors.category))}
          >
            {expenseCategories.map((expenseCategory) => (
              <option key={expenseCategory} value={expenseCategory}>
                {expenseCategory}
              </option>
            ))}
          </select>

          {errors.category && (
            <p
              id="category-error"
              role="alert"
              className="text-sm text-error"
            >
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Currency */}
        <Controller
          name="currency"
          control={control}
          render={({ field, fieldState }) => (
            <CurrencySelector
              name={field.name}
              label="Currency"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* Amount */}
        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-text-primary"
          >
            Amount
          </label>

          <input
            {...register("amount", {
              valueAsNumber: true,
            })}
            id="amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            inputMode="decimal"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            className={inputClassName(Boolean(errors.amount))}
          />

          {errors.amount && (
            <p id="amount-error" role="alert" className="text-sm text-error">
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-text-primary"
        >
          Frequency
        </label>

        <select
          {...register("frequency")}
          id="frequency"
          className={selectClassName(false)}
        >
          <option value="one-time">One-time</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-text-primary"
        >
          Notes <span className="font-normal text-text-muted">(Optional)</span>
        </label>

        <textarea
          {...register("notes")}
          id="notes"
          rows="3"
          placeholder="Add extra details..."
          className={`${inputClassName(false)} resize-none`}
        />
      </div>

      {/* Server error */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          <span>{submitError}</span>

          <button
            type="button"
            onClick={() => setSubmitError("")}
            className="shrink-0 rounded-md p-1 text-error transition-colors hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Actions */}
      {editingExpense === null ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add expense"}
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Update expense"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-input-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-divider/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}

export default ExpenseForm