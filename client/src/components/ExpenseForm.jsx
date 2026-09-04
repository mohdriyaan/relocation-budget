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

  const fieldClassName = (hasError) =>
    [
      "control-surface",
      "w-full",
      "px-3",
      "py-2.5",
      "text-sm",
      "text-text-primary",
      "placeholder:text-text-muted",
      "transition-colors",
      hasError ? "!border-error" : "",
    ]
      .filter(Boolean)
      .join(" ")

  const labelClassName =
    "block text-sm font-medium text-text-muted"

  const errorClassName =
    "text-sm leading-5 text-error"

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      className="space-y-6"
    >
      {/* Edit mode */}
      {editingExpense !== null && (
        <div className="flex flex-col gap-3 border-y border-information/25 bg-information/4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-text-muted">
            Editing{" "}
            <span className="font-medium text-text-primary">
              {editingExpense.name}
            </span>
          </p>

          <button
            type="button"
            onClick={handleCancel}
            className="w-fit text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Name + Category */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClassName}>
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
            className={fieldClassName(Boolean(errors.name))}
          />

          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className={errorClassName}
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>

          <select
            {...register("category")}
            id="category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "category-error" : undefined
            }
            className={fieldClassName(Boolean(errors.category))}
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
              className={errorClassName}
            >
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Currency + Amount */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

        <div className="space-y-2">
          <label htmlFor="amount" className={labelClassName}>
            Amount
          </label>

          <input
            {...register("amount", {
              setValueAs: (value) =>
                value === "" ? undefined : Number(value),
            })}
            id="amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            inputMode="decimal"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={
              errors.amount ? "amount-error" : undefined
            }
            className={`${fieldClassName(
              Boolean(errors.amount)
            )} tabular-nums`}
          />

          {errors.amount && (
            <p
              id="amount-error"
              role="alert"
              className={errorClassName}
            >
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <label htmlFor="frequency" className={labelClassName}>
          Frequency
        </label>

        <select
          {...register("frequency")}
          id="frequency"
          className={fieldClassName(false)}
        >
          <option value="one-time">One-time</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className={labelClassName}>
          Notes{" "}
          <span className="font-normal text-text-muted">
            (Optional)
          </span>
        </label>

        <textarea
          {...register("notes")}
          id="notes"
          rows="4"
          placeholder="Add extra details..."
          className={`${fieldClassName(false)} resize-none`}
        />
      </div>

      {/* Server error */}
      {submitError && (
        <div
          role="alert"
          className="border-y border-error/25 bg-error/4 py-4"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-5 text-error px-4 py-2">
              {submitError}
            </p>

            <button
              type="button"
              onClick={() => setSubmitError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-md p-1 text-error transition-colors hover:bg-error/10"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {editingExpense === null ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add expense"}
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Update expense"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-border-standard px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}

export default ExpenseForm