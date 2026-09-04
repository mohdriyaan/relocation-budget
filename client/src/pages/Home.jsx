import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth.js"
import useDashboardData from "../hooks/useDashboardData.js"
import formatCurrency from "../utils/formatCurrency.js"
import getBudgetStatus from "../utils/getBudgetStatus.js"

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
    convertedExpenseDetails,
  } = useDashboardData()

  const formatMoney = (currency, amount) => {
    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount)) {
      return {
        currency,
        value: "0.00",
      }
    }

    return {
      currency,
      value: formatCurrency(numericAmount),
    }
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
      ? Math.max((remainingBudget / convertedSavings) * 100, 0)
      : 0

  const budgetStatus = hasActiveBudget
    ? getBudgetStatus(remainingBudget)
    : null

  const isOverBudget = budgetStatus?.key === "over-budget"

  const savings = formatMoney(
    budget?.destinationCurrency,
    convertedSavings
  )

  const planned = formatMoney(
    budget?.destinationCurrency,
    convertedExpenses
  )

  const remaining = formatMoney(
    budget?.destinationCurrency,
    remainingBudget
  )

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="space-y-12">
          {/* Header */}
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium text-text-muted">
                Relocation budget
              </p>

              <h1 className="text-3xl font-semibold leading-tighter tracking-tightest text-text-primary sm:text-4xl">
                Welcome back, {user?.name || "User"}.
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-text-muted sm:text-base sm:leading-7">
                Keep your relocation plan grounded in what you can
                comfortably afford.
              </p>
            </div>

            <Link
              to="/calculator"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Open Calculator
            </Link>
          </header>

          {/* Budget Overview */}
          <section className="space-y-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold leading-tight tracking-tightest text-text-primary">
                  Budget overview
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  A clear view of what is available, planned, and left.
                </p>
              </div>

              {hasActiveBudget && (
                <Link
                  to="/calculator"
                  className="w-fit text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
                >
                  Manage expenses
                </Link>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div
                role="status"
                aria-label="Loading dashboard"
                className="space-y-8"
              >
                <div className="border-y border-border-subtle py-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="space-y-3">
                        <div className="h-3 w-20 animate-pulse bg-border-subtle" />
                        <div className="h-7 w-32 animate-pulse bg-border-subtle" />
                        <div className="h-3 w-28 animate-pulse bg-border-subtle" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 h-1.5 animate-pulse bg-border-subtle" />
                </div>

                <div className="border-y border-border-subtle py-8">
                  <div className="h-4 w-24 animate-pulse bg-border-subtle" />
                  <div className="mt-4 h-12 animate-pulse bg-border-subtle" />
                  <div className="mt-4 h-12 animate-pulse bg-border-subtle" />
                  <div className="mt-4 h-12 animate-pulse bg-border-subtle" />
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                role="alert"
                className="border-y border-error/30 py-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-text-primary">
                      Unable to load dashboard
                    </h3>

                    <p className="text-sm leading-6 text-text-muted">
                      {error}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="inline-flex items-center justify-center rounded-lg border border-border-standard px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-raised"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* No Budget */}
            {!loading && !error && !budget && (
              <section className="border-y border-border-subtle py-12">
                <div className="max-w-xl space-y-5">
                  <p className="text-sm font-medium text-information">
                    Getting started
                  </p>

                  <h3 className="text-2xl font-semibold leading-tight tracking-tightest text-text-primary">
                    Set up your relocation budget
                  </h3>

                  <p className="text-sm leading-6 text-text-muted sm:text-base sm:leading-7">
                    Add your savings and destination currency to begin
                    planning your relocation costs.
                  </p>

                  <Link
                    to="/calculator"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    Set up budget
                  </Link>
                </div>
              </section>
            )}

            {/* Active Budget */}
            {hasActiveBudget && (
              <div className="space-y-10">
                {/* Budget Bridge */}
                <section className="border-y border-border-subtle bg-surface">
                  <div className="px-5 py-7 sm:px-7 sm:py-8">
                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0">
                      <div className="space-y-3 sm:border-r sm:border-border-subtle sm:pr-8">
                        <p className="text-sm font-medium text-text-muted">
                          Available
                        </p>

                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-text-muted">
                            {savings.currency}
                          </span>

                          <span className="text-xl font-medium tabular-nums text-text-primary">
                            {savings.value}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted">
                          Converted savings
                        </p>
                      </div>

                      <div className="space-y-3 sm:border-r sm:border-border-subtle sm:px-8">
                        <p className="text-sm font-medium text-text-muted">
                          Planned
                        </p>

                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-text-muted">
                            {planned.currency}
                          </span>

                          <span className="text-xl font-medium tabular-nums text-text-primary">
                            {planned.value}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted">
                          Planned expenses
                        </p>
                      </div>

                      <div className="space-y-3 sm:pl-8">
                        <p className="text-sm font-medium text-text-muted">
                          Remaining
                        </p>

                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-medium text-text-muted">
                            {remaining.currency}
                          </span>

                          <span
                            className={`text-xl font-medium tabular-nums ${
                              isOverBudget
                                ? "text-error"
                                : "text-success"
                            }`}
                          >
                            {remaining.value}
                          </span>

                          <span className="text-xs font-medium text-text-muted">
                            {budgetStatus?.label}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted">
                          After planned expenses
                        </p>
                      </div>
                    </div>

                    {/* Allocation Bridge */}
                    <div className="mt-8 border-t border-border-subtle pt-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            Budget allocation
                          </p>

                          <p className="mt-1 text-sm text-text-muted">
                            {planned.value} planned{" "}
                            <span className="text-text-muted">/</span>{" "}
                            {remaining.value} remaining
                          </p>
                        </div>

                        <span className="text-sm font-medium tabular-nums text-text-muted">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>

                      <div
                        className="mt-5 h-1.5 overflow-hidden rounded-full bg-border-subtle"
                        role="progressbar"
                        aria-label={`${Math.round(
                          progressPercentage
                        )}% of available savings planned`}
                        aria-valuenow={Math.round(progressPercentage)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className={`h-full rounded-full transition-[width] duration-300 ${
                            isOverBudget
                              ? "bg-error"
                              : "bg-primary"
                          }`}
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs leading-5 text-text-muted">
                        {isOverBudget
                          ? `${Math.abs(
                              Math.round(plannedPercentage - 100)
                            )}% above available savings`
                          : `${Math.round(
                              remainingPercentage
                            )}% of your savings remains unplanned`}
                      </p>
                    </div>
                  </div>

                  {/* Internal Insight Division */}
                  <div className="border-t border-border-subtle px-5 py-6 sm:px-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-xs font-medium text-text-muted">
                          Planning insight
                        </p>

                        <h3 className="mt-1 text-base font-semibold leading-tight text-text-primary">
                          {isOverBudget
                            ? "Your current plan is above your available savings."
                            : remainingBudget === 0
                              ? "Your available savings are fully allocated."
                              : "Your relocation plan still has room."}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-text-muted">
                          {isOverBudget
                            ? "Review your largest planned costs and reduce or reprioritize expenses."
                            : remainingBudget === 0
                              ? "Review your assumptions before committing to additional costs."
                              : `You still have ${remaining.currency} ${remaining.value} available for costs you haven't planned yet.`}
                        </p>
                      </div>

                      <Link
                        to="/calculator"
                        className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg border border-border-standard px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-raised"
                      >
                        Manage expenses
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Expenses */}
                <section className="border-y border-border-subtle">
                  <div className="flex flex-col gap-3 border-b border-border-subtle py-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold leading-tight tracking-tightest text-text-primary">
                        Expenses
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-text-muted">
                        Your largest planned relocation costs.
                      </p>
                    </div>

                    {expenses.length > 5 && (
                      <Link
                        to="/calculator"
                        className="w-fit text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
                      >
                        View all {expenses.length}
                      </Link>
                    )}
                  </div>

                  {displayedExpenses.length === 0 ? (
                    <div className="py-8">
                      <p className="text-sm text-text-muted">
                        No expenses have been added yet.
                      </p>

                      <Link
                        to="/calculator"
                        className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
                      >
                        Add an expense
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-divider">
                      {displayedExpenses.map((expense) => (
                        <div
                          key={expense._id}
                          className="flex items-center justify-between gap-6 py-5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text-primary">
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

                          <div className="grid shrink-0 grid-cols-[3rem_7rem] items-baseline gap-3 text-right">
                            <span className="text-xs font-medium text-text-muted">
                              {expense.currency}
                            </span>

                            <span className="text-sm font-medium tabular-nums text-text-primary">
                              {formatCurrency(
                                Number(expense.amount) || 0
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default Home