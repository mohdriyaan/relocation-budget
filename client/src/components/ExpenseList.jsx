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
        className="border-y border-border-subtle"
      >
        <div className="flex items-center justify-between border-b border-border-subtle py-5">
          <div className="h-5 w-32 animate-pulse bg-border-subtle" />
          <div className="h-4 w-16 animate-pulse bg-border-subtle" />
        </div>

        <div className="divide-y divide-divider">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[minmax(0,1fr)_3rem_7rem_auto] items-center gap-4 py-5"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse bg-border-subtle" />
                <div className="h-3 w-24 animate-pulse bg-border-subtle" />
              </div>

              <div className="h-3 w-8 justify-self-end animate-pulse bg-border-subtle" />

              <div className="h-4 w-20 justify-self-end animate-pulse bg-border-subtle" />

              <div className="h-8 w-16 justify-self-end animate-pulse bg-border-subtle" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="border-y border-error/30 py-5 text-sm text-error"
      >
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* Ledger header */}
      <div className="flex flex-col gap-3 border-b border-border-subtle py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            ref={headingRef}
            tabIndex="-1"
            className="text-xl font-semibold leading-tighter tracking-tightest text-text-primary focus:outline-none"
          >
            Planned expenses
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Review and manage your relocation costs.
          </p>
        </div>

        <span className="text-sm tabular-nums text-text-muted">
          {expenses.length}{" "}
          {expenses.length === 1 ? "expense" : "expenses"}
        </span>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div
          role="alert"
          className="border-b border-error/30 py-4 text-sm text-error"
        >
          {deleteError}
        </div>
      )}

      {/* Empty state */}
      {expenses.length === 0 ? (
        <div className="border-b border-border-subtle py-16 text-center">
          <p className="text-sm font-medium text-text-primary">
            No expenses yet
          </p>

          <p className="mt-2 text-sm text-text-muted">
            Add your first relocation expense to start building your budget.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-divider">
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