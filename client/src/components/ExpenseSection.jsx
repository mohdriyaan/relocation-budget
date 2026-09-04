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
    <div className="space-y-10">
      {/* Add expense */}
      <section className="border-y border-border-subtle py-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium text-text-muted">
            Expense planning
          </p>

          <h2 className="text-xl font-semibold leading-tight tracking-tight text-text-primary">
            Add an expense
          </h2>

          <p className="text-sm leading-6 text-text-muted">
            Track a relocation cost in its original currency.
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
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
      <section>
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