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

  function changeHandler(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function submitHandler(event) {
    event.preventDefault()
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
            required
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
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
            className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            {expenseCategories.map((expenseCategory) => (
              <option key={expenseCategory} value={expenseCategory}>
                {expenseCategory}
              </option>
            ))}
          </select>
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
          required
          className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg p-3 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
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