// components/ExpenseList.jsx

import ExpenseItem from "./ExpenseItem.jsx";

const ExpenseList = ({ expenses = [], onDeleteExpense, isLoading }) => {
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

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm bg-slate-900/50 rounded-xl border border-slate-800">
        No expenses recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDeleteExpense={onDeleteExpense}
        />
      ))}
    </div>
  );
};

export default ExpenseList;