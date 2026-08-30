// components/ExpenseList.jsx

import ExpenseItem from "./ExpenseItem.jsx";

const ExpenseList = ({ expenses = [], onDeleteExpense, isLoading, error }) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2.5 py-8 text-slate-400 text-sm bg-slate-900/50 rounded-xl border border-slate-800 font-medium">
        <svg
          className="animate-spin h-5 w-5 text-indigo-400"
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
        <span>Loading expenses...</span>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center justify-center gap-2 py-8 text-rose-400 text-sm bg-rose-500/10 rounded-xl border border-rose-500/30 font-medium px-4 text-center"
      >
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
        <span>{error}</span>
      </div>
    );
  }

  // 3. Empty State
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm bg-slate-900/50 rounded-xl border border-slate-800">
        No expenses recorded yet.
      </div>
    );
  }

  // 4. Render Expenses List
  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onDeleteExpense={onDeleteExpense}
          onEditExpense={onEditExpense}
        />
      ))}
    </div>
  );
};

export default ExpenseList;