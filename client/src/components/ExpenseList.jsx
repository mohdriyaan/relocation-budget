// components/ExpenseList.jsx

import ExpenseItem from "./ExpenseItem.jsx";

const ExpenseList = ({ expenses = [], onDeleteExpense }) => {
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