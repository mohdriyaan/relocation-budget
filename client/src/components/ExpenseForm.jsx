// components/ExpenseForm.jsx
import { useEffect, useState } from "react"
import expenseCategories from "../data/expenseCategories.js"
import CurrencySelector from "./CurrencySelector.jsx"
import { createExpense, updateExpense } from "../services/expenseApi.js"
import ExpenseSchema from "../schemas/expenseSchema.js"
import { z } from "zod"
import { useForm } from "react-hook-form"

const ExpenseForm = ({ addExpense, destinationCurrency, editingExpense, onUpdateExpense, onEditComplete, onCancelEdit}) => {
  const {
    register,
    handleSubmit : rhfHandleSubmit,
    reset : rfhReset,
    formState : {errors : rhfErrors, isSubmitting : rhfIsSubmitting}
  } = useForm()

  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    currency: destinationCurrency || "NZD",
    amount: "",
    notes: "",
    frequency: "one-time"
  })

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    amount: ""
  })

  const [submitError, setSubmitError] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingExpense !== null) {
      const { name, category, currency, amount, frequency, notes } = editingExpense

      setFormData((prev) => ({
        ...prev,
        name,
        category,
        currency: currency || destinationCurrency,
        amount,
        frequency,
        notes: notes ?? ""
      }))   
    } else {
      setFormData((prev) => ({
        ...prev,
        currency: destinationCurrency
      }))
    }
  }, [editingExpense, destinationCurrency])

  function changeHandler(event) {
    const { name, value } = event.target
    
    // Clear top-level submission error when user edits fields
    if (submitError) setSubmitError("")

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if(name === "name" || name === "category" || name === "amount"){
      setErrors((prev)=> ({
        ...prev,
        [name] : ""
      }))
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      category: "Other",
      currency: destinationCurrency || "NZD",
      amount: "",
      notes: "",
      frequency: "one-time"
    })
  }

  function handleCancel() {
    resetForm()
    onCancelEdit()
  }

  async function submitHandler(event) {
    event.preventDefault()

    const validationData = {
      ...formData,
      amount : Number(formData.amount)
    }

    const validationResult = ExpenseSchema.safeParse(validationData)

    if(!validationResult.success){
      const fieldErrors = z.flattenError(validationResult.error).fieldErrors
      
      setErrors({
        name : fieldErrors.name?.[0] || "",
        category: fieldErrors.category?.[0] || "",
        amount: fieldErrors.amount?.[0] || ""
      })

      return;
    }

    const expensePayload = {
      ...formData,
      currency: formData.currency || destinationCurrency
    }

    setIsSubmitting(true)

    try {
      setSubmitError("")
      const result = editingExpense === null ?   
      await createExpense(expensePayload) : 
      await updateExpense(editingExpense._id, expensePayload)

      if (result.expense) {
        if (editingExpense === null) {
          addExpense(result.expense)
          resetForm()
        } else {
          onUpdateExpense(result.expense)
          onEditComplete()
          resetForm()
        } 
      }
    } catch (error) {
      setSubmitError("Unable to save expense. Please check your network connection and try again.")
    } finally {
      setIsSubmitting(false)
    }  
  }

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      
      {/* Edit Mode Banner */}
      {editingExpense !== null && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>Editing item: <strong className="text-white font-mono">{editingExpense.name}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs text-indigo-400 hover:text-white underline font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Expense Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Expense Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="e.g. Flight Ticket"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 ${
              errors.name
                ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
                : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.name && (
            <span
              id="name-error"
              role="alert"
              className="mt-2 text-xs sm:text-sm text-rose-400 flex items-center gap-1.5 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.name}</span>
            </span>
          )}
        </div>

        {/* Category Selector */}
        <div className="flex flex-col">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 ${
              errors.category
                ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
                : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          >
            {expenseCategories.map((expenseCategory) => (
              <option key={expenseCategory} value={expenseCategory}>
                {expenseCategory}
              </option>
            ))}
          </select>
          {errors.category && (
            <span
              id="category-error"
              role="alert"
              className="mt-2 text-xs sm:text-sm text-rose-400 flex items-center gap-1.5 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.category}</span>
            </span>
          )}
        </div>

        {/* Expense Currency Selector */}
        <CurrencySelector
          name="currency"
          label="Currency"
          value={formData.currency}
          onChange={changeHandler}
        />

        {/* Amount Input */}
        <div className="flex flex-col">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
            Amount
          </label>
          <input
            {...register("amount", {
              valueAsNumber : true
            })}
            type="number"
            id="amount"
            placeholder="0.00"
            min="0"
            step="0.01"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 ${
              errors.amount
                ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
                : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.amount && (
            <span
              id="amount-error"
              role="alert"
              className="mt-2 text-xs sm:text-sm text-rose-400 flex items-center gap-1.5 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.amount}</span>
            </span>
          )}
        </div>

        {/* Frequency Selector */}
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="frequency" className="block text-sm font-medium text-slate-300 mb-2">
            Frequency
          </label>
          <select
            {...register("frequency")}
            id="frequency"
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="one-time">One-time</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="flex flex-col">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          rows="2"
          placeholder="Add extra details..."
          className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
        ></textarea>
      </div>

      {/* Form Submission Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between gap-3 font-medium transition-all"
        >
          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 text-rose-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{submitError}</span>
          </div>

          <button
            type="button"
            onClick={() => setSubmitError("")}
            className="text-rose-400/70 hover:text-rose-300 p-1 rounded-md hover:bg-rose-500/20 transition-colors"
            aria-label="Dismiss error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {editingExpense === null ? (
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
         {isSubmitting ? "Saving..." : "Add Expense"} 
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Update Expense"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}

export default ExpenseForm