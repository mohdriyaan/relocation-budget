import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"

function ExpenseSection({
  addExpense,
  destinationCurrency,
  editingExpense,
  onUpdateExpense,
  onEditComplete,
  onCancelEdit,
  expenses,
  onDeleteExpense,
  onEditExpense,
  isLoading,
  error,
  deleteError
}) {
  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-4">
          2. Add Expense
        </h2>
        <ExpenseForm 
          addExpense={addExpense}        destinationCurrency={destinationCurrency}
          editingExpense={editingExpense}
          onUpdateExpense={onUpdateExpense}
          onEditComplete={onEditComplete}
          onCancelEdit={onCancelEdit}
        />
      </div>

      {/* Expense List Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Planned Expenses
          </h2>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            Total Items: {expenses.length}
          </span>
        </div>
        <ExpenseList 
          expenses={expenses} 
          onDeleteExpense={onDeleteExpense}
          onEditExpense={onEditExpense}
          isLoading={isLoading}
          deleteError={deleteError}
          error={error} 
        />
      </div>
    </>
  )
}
export default ExpenseSection