import ExpenseItem from "./ExpenseItem.jsx"

const ExpenseList = ({
  expenses = [],
  onDeleteExpense,
  isLoading,
  error,
  deleteError,
  onEditExpense,
  headingRef,
  onDeleteConfirmed,
}) => {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading expenses"
        className="space-y-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="h-6 w-36 animate-pulse rounded bg-divider" />
          <div className="h-5 w-16 animate-pulse rounded bg-divider" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-lg bg-divider"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-error/40 bg-error/10 px-4 py-4 text-sm text-error"
      >
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            ref={headingRef}
            tabIndex="-1"
            className="text-xl font-semibold text-text-primary focus:outline-none"
          >
            Planned expenses
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Review and manage your relocation costs.
          </p>
        </div>

        <span className="text-sm text-text-muted">
          {expenses.length}{" "}
          {expenses.length === 1 ? "expense" : "expenses"}
        </span>
      </div>

      {/* Delete error — conditionally mounted */}
      {deleteError && (
        <div
          role="alert"
          className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {deleteError}
        </div>
      )}

      {/* Empty */}
      {expenses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-divider px-6 py-8 text-center">
          <p className="text-sm font-medium text-text-primary">
            No expenses yet
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Add your first relocation expense to start building your budget.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onDeleteExpense={onDeleteExpense}
              onEditExpense={onEditExpense}
              onDeleteConfirmed={onDeleteConfirmed}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList