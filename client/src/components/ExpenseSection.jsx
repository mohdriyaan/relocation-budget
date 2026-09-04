import { useRef } from "react"
import ExpenseForm from "./ExpenseForm.jsx"
import ExpenseList from "./ExpenseList.jsx"

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
  deleteError,
}) {
  const expenseHeadingRef = useRef(null)

  const focusExpenseHeading = () => {
    expenseHeadingRef.current?.focus()
  }

  return (
    <div className="space-y-8">
      {/* Add expense */}
      <section className="rounded-xl border border-divider bg-surface p-6 sm:p-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-text-primary">
            Add an expense
          </h2>

          <p className="text-sm leading-6 text-text-muted">
            Track a relocation cost in its original currency.
          </p>
        </div>

        <div className="mt-6">
          <ExpenseForm
            addExpense={addExpense}
            destinationCurrency={destinationCurrency}
            editingExpense={editingExpense}
            onUpdateExpense={onUpdateExpense}
            onEditComplete={onEditComplete}
            onCancelEdit={onCancelEdit}
          />
        </div>
      </section>

      {/* Planned expenses */}
      <section className="rounded-xl border border-divider bg-surface p-6 sm:p-8">
        <ExpenseList
          expenses={expenses}
          onDeleteExpense={onDeleteExpense}
          onEditExpense={onEditExpense}
          isLoading={isLoading}
          error={error}
          deleteError={deleteError}
          headingRef={expenseHeadingRef}
          onDeleteConfirmed={focusExpenseHeading}
        />
      </section>
    </div>
  )
}

export default ExpenseSection