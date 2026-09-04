import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth.js"
import useDashboardData from "../hooks/useDashboardData.js"
import formatCurrency from "../utils/formatCurrency.js"

const Home = () => {
  const { user } = useAuth()

  const {
    expenses,
    budget,
    convertedSavings,
    convertedExpenses,
    remainingBudget,
    loading,
    error,
    fetchDashboardData,
    convertedExpenseDetails
  } = useDashboardData()

  const formatMoney = (currency, amount) => {
    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount)) {
      return `${currency} 0.00`
    }

    return `${currency} ${formatCurrency(numericAmount)}`
  }

  const displayedExpenses = [...convertedExpenseDetails]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5)

  const hasActiveBudget =
    !loading &&
    !error &&
    budget &&
    convertedSavings !== null &&
    convertedExpenses !== null &&
    remainingBudget !== null

  const isOverBudget = hasActiveBudget && remainingBudget < 0

  const plannedPercentage =
    hasActiveBudget && convertedSavings > 0
      ? (convertedExpenses / convertedSavings) * 100
      : 0

  const progressPercentage = Math.min(
    Math.max(plannedPercentage, 0),
    100
  )

  const remainingPercentage =
    hasActiveBudget && convertedSavings > 0
      ? Math.max(remainingBudget / convertedSavings, 0)
      : 0

  const statusLabel =
    remainingBudget < 0 ? "Over budget" : "Healthy"

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-canvas px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* Welcome */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Welcome back, {user?.name || "User"}
            </h1>

            <p className="text-sm leading-6 text-text-muted sm:text-base">
              See how much of your relocation budget is available,
              planned, and remaining.
            </p>
          </div>

          <Link
            to="/calculator"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas"
          >
            Open Calculator
          </Link>
        </section>

        {/* Budget Overview */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Budget overview
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Your current relocation budget position.
              </p>
            </div>

            {hasActiveBudget && (
              <Link
                to="/calculator"
                className="w-fit text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas"
              >
                Manage expenses
              </Link>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div
              aria-label="Loading dashboard"
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-6 border-y border-divider py-6 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-divider" />
                    <div className="h-8 w-36 animate-pulse rounded bg-divider" />
                    <div className="h-3 w-32 animate-pulse rounded bg-divider" />
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="h-40 animate-pulse rounded-xl bg-divider" />
                <div className="h-40 animate-pulse rounded-xl bg-divider" />
              </div>

              <div className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded bg-divider" />
                <div className="h-16 animate-pulse rounded-lg bg-divider" />
                <div className="h-16 animate-pulse rounded-lg bg-divider" />
                <div className="h-16 animate-pulse rounded-lg bg-divider" />
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-error/40 bg-error/10 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Unable to load dashboard
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="inline-flex items-center justify-center rounded-lg border border-input-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-divider/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* No Budget */}
          {!loading && !error && !budget && (
            <div className="rounded-xl border border-divider bg-surface px-6 py-10 text-center sm:px-10">
              <div className="mx-auto max-w-lg space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-information/30 bg-information/10 text-information">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12M6 12h12"
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    Set up your relocation budget
                  </h3>

                  <p className="text-sm leading-6 text-text-muted sm:text-base">
                    Add your savings and destination currency to start
                    planning your relocation costs.
                  </p>
                </div>

                <Link
                  to="/calculator"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                >
                  Set up budget
                </Link>
              </div>
            </div>
          )}

          {/* Active Budget */}
          {hasActiveBudget && (
            <>
              {/* Financial Snapshot */}
              <div className="grid grid-cols-1 gap-6 border-y border-divider py-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-muted">
                    Available
                  </p>

                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-text-primary sm:text-3xl">
                    {formatMoney(
                      budget.destinationCurrency,
                      convertedSavings
                    )}
                  </p>

                  <p className="text-xs text-text-muted">
                    Savings converted
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-muted">
                    Planned
                  </p>

                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-text-primary sm:text-3xl">
                    {formatMoney(
                      budget.destinationCurrency,
                      convertedExpenses
                    )}
                  </p>

                  <p className="text-xs text-text-muted">
                    Planned expenses
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-muted">
                    Remaining
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl ${isOverBudget
                          ? "text-error"
                          : "text-success"
                        }`}
                    >
                      {formatMoney(
                        budget.destinationCurrency,
                        remainingBudget
                      )}
                    </p>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${isOverBudget
                          ? "border-error/40 bg-error/10 text-error"
                          : "border-success/40 bg-success/10 text-success"
                        }`}
                    >
                      <span aria-hidden="true">
                        {isOverBudget ? "!" : "✓"}
                      </span>

                      <span>{statusLabel}</span>
                    </span>
                  </div>

                  <p className="text-xs text-text-muted">
                    After planned expenses
                  </p>
                </div>
              </div>

              {/* Budget Position + Next Step */}
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <section className="rounded-xl border border-divider bg-surface p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">
                        Budget position
                      </h3>

                      <p className="mt-1 text-sm text-text-muted">
                        {formatMoney(
                          budget.destinationCurrency,
                          convertedExpenses
                        )}{" "}
                        of{" "}
                        {formatMoney(
                          budget.destinationCurrency,
                          convertedSavings
                        )}{" "}
                        planned
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold tabular-nums text-text-primary">
                      {Math.round(plannedPercentage)}%
                    </span>
                  </div>

                  <div
                    className="mt-5 h-2.5 overflow-hidden rounded-full bg-divider"
                    aria-label={`${Math.round(plannedPercentage)} percent of available savings planned`}
                    role="progressbar"
                    aria-valuenow={Math.round(progressPercentage)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-300 ${isOverBudget
                          ? "bg-error"
                          : "bg-primary"
                        }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-text-muted">
                    {isOverBudget
                      ? `${Math.abs(Math.round(plannedPercentage - 100))}% above available savings`
                      : `${Math.round(remainingPercentage * 100)}% of your savings remains unplanned`}
                  </p>
                </section>

                <section
                  className={`rounded-xl border p-6 ${isOverBudget
                      ? "border-error/40 bg-error/10"
                      : "border-divider bg-surface"
                    }`}
                >
                  <p className="text-sm font-semibold text-text-primary">
                    What to do next
                  </p>

                  <div className="mt-3 space-y-2">
                    {isOverBudget ? (
                      <>
                        <h3 className="text-lg font-semibold text-text-primary">
                          Review your expenses
                        </h3>

                        <p className="text-sm leading-6 text-text-muted">
                          Your planned expenses are above your available
                          savings. Review the largest costs and adjust your
                          plan.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {remainingBudget === 0
                            ? "Your budget is fully planned"
                            : "Keep your estimate current"}
                        </h3>

                        <p className="text-sm leading-6 text-text-muted">
                          {remainingBudget === 0
                            ? "Your available savings are fully allocated to planned expenses."
                            : `You have ${formatMoney(
                              budget.destinationCurrency,
                              remainingBudget
                            )} remaining. Add or review expenses as your relocation plans change.`}
                        </p>
                      </>
                    )}
                  </div>

                  <Link
                    to="/calculator"
                    className="mt-5 inline-flex items-center justify-center rounded-lg border border-input-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-divider/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                  >
                    Manage expenses
                  </Link>
                </section>
              </div>

              {/* Expense Overview */}
              <section className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Expenses
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                      Your largest planned relocation costs.
                    </p>
                  </div>

                  {expenses.length > 5 && (
                    <Link
                      to="/calculator"
                      className="w-fit text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas"
                    >
                      View all {expenses.length} expenses 
                    </Link>
                  )}

                </div>

                {displayedExpenses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-divider bg-surface px-6 py-8">
                    <p className="text-sm text-text-muted">
                      No expenses have been added yet.
                    </p>

                    <Link
                      to="/calculator"
                      className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                    >
                      Add an expense
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-divider rounded-xl border border-divider bg-surface">
                    {displayedExpenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {expense.name}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {expense.category || "General"}
                            {" · "}
                            {expense.frequency === "monthly"
                              ? "Monthly"
                              : "One-time"}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold tabular-nums text-text-primary">
                          {formatMoney(
                            expense.currency,
                            expense.amount
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Home