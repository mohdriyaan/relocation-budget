// components/ExpenseForm.jsx
import { useState } from "react"
import expenseCategories from "../data/expenseCategories.js"

const ExpenseForm = ({ addExpense }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    amount: "",
    notes: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    amount: ""
  })

  function changeHandler(event) {
    const { name, value } = event.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if(name === "name"){
      checkNameError(value)
    }

    if(name === "amount"){
      checkAmountError(value)
    }

    if(name === "category"){
      checkCategoryError(value)
    }
  }

  function checkNameError(name){
    if(name === "" && name.length === 0){
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required"
      }))
      return false
    }
    
    if(name.includes(" ")){
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Invalid name"
      }))
      return false
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      name: ""
    }))

    return true
  }

  function checkAmountError(amount){
    if(amount == ""){
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: "Amount is required"
      }))
      return false
    }
    
    if(amount <= 0){
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: "Amount must be greater than zero"
      }))
      return false
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      amount: ""
    }))

    return true
  }

  function checkCategoryError(category){
    if(!expenseCategories.includes(category)){
      setErrors((prevErrors) => ({
        ...prevErrors,
        category: "Category should only be selected from the list"
      }))
      return false
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      category: ""
    }))

    return true
  }

  function submitHandler(event) {
    event.preventDefault()
    const isValid = checkNameError(formData.name) && checkAmountError(formData.amount) && checkCategoryError(formData.category)

    if(!isValid){
      return;
    }
    
    addExpense(formData)
    setFormData({
      name: "",
      category: "Other",
      amount: "",
      notes: ""
    })
  }

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Expense Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Expense Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            value={formData.name}
            onChange={changeHandler}
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
            name="category"
            id="category"
            value={formData.category}
            onChange={changeHandler}
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
      </div>

      {/* Amount Input */}
      <div className="flex flex-col">
        <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={changeHandler}
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

      {/* Notes Textarea */}
      <div className="flex flex-col">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          id="notes"
          rows="2"
          value={formData.notes}
          onChange={changeHandler}
          placeholder="Add extra details..."
          className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Add Expense
      </button>
    </form>
  )
}

export default ExpenseForm