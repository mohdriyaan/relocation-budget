import { useEffect, useRef, useState } from "react"
import formatCurrency from "../utils/formatCurrency.js"

const ExpenseItem = ({
  expense,
  onDeleteExpense,
  onEditExpense,
  onDeleteConfirmed,
}) => {
  const {
    _id,
    category,
    name,
    amount,
    currency,
    notes,
    frequency,
  } = expense

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const cancelButtonRef = useRef(null)
  const deleteButtonRef = useRef(null)

  useEffect(() => {
    if (isConfirmingDelete) {
      cancelButtonRef.current?.focus()
    }
  }, [isConfirmingDelete])

  const formattedAmount = formatCurrency(Number(amount) || 0)

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true)
  }

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false)
  }

  const handleConfirmDelete = async () => {
    try {
      await onDeleteExpense(_id)
      setIsConfirmingDelete(false)
      onDeleteConfirmed?.()
    } catch {
      setIsConfirmingDelete(false)

      requestAnimationFrame(() => {
        deleteButtonRef.current?.focus()
      })
    }
  }

  return (
    <article className="group border-b border-white/5 transition-colors hover:bg-white/2">
      {!isConfirmingDelete ? (
        <div className="grid grid-cols-1 gap-5 px-1 py-6 sm:grid-cols-[minmax(0,1fr)_4rem_8rem_4.5rem] sm:items-center sm:gap-5">

          {/* Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-text-muted">
                {category || "General"}
              </span>

              <span
                aria-hidden="true"
                className="text-xs text-white/20"
              >
                ·
              </span>

              <span className="text-xs text-text-muted">
                {frequency === "monthly"
                  ? "Monthly"
                  : "One-time"}
              </span>
            </div>

            <h3 className="mt-1 truncate text-sm font-medium text-text-primary">
              {name}
            </h3>

            {notes && (
              <p className="mt-1 truncate text-sm text-text-muted">
                {notes}
              </p>
            )}
          </div>

          {/* Currency */}
          <span className="justify-self-end text-xs font-medium text-text-muted">
            {currency}
          </span>

          {/* Amount */}
          <span className="justify-self-end text-sm font-medium tabular-nums text-text-primary">
            {formattedAmount}
          </span>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onEditExpense(expense)}
              aria-label={`Edit ${name}`}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 2.651 2.65M5.25 18.75l.893-3.572a2.25 2.25 0 0 1 .62-1.053L15.6 5.288a2.121 2.121 0 0 1 3 3l-9.038 9.037a2.25 2.25 0 0 1-1.053.62L5.25 18.75Z"
                />
              </svg>
            </button>

            <button
              ref={deleteButtonRef}
              type="button"
              onClick={handleDeleteClick}
              aria-label={`Delete ${name}`}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-error/10 hover:text-error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .75 12h6.5L16 7M10 11v5m4-5v5"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-error/20 bg-error/5 px-4 py-5 sm:px-5 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Delete this expense?
              </p>

              <p className="mt-1 text-sm text-text-muted">
                This will permanently remove{" "}
                <span className="font-medium text-text-primary">
                  {name}
                </span>
                .
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={handleCancelDelete}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-error px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-error/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default ExpenseItem