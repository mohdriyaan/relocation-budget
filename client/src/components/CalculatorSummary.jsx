import formatCurrency from "../utils/formatCurrency.js"
import getBudgetStatus from "../utils/getBudgetStatus.js"

const CalculatorSummary = ({
  originCurrency,
  destinationCurrency,
  savings,
  result,
  remainingBudget,
  totalExpenses,
  oneTimeExpenses,
  monthlyExpenses,
  runway,
  rate,
}) => {
  const budgetStatus = getBudgetStatus(remainingBudget)
  const hasKnownStatus = budgetStatus.key !== "unknown"
  const isOverBudget = budgetStatus.key === "over-budget"

  const formatMoney = (currency, amount) => ({
    currency,
    value: formatCurrency(Number(amount) || 0),
  })

  const convertedSavings = formatMoney(
    destinationCurrency,
    result
  )

  const planned = formatMoney(
    destinationCurrency,
    totalExpenses
  )

  const remaining = formatMoney(
    destinationCurrency,
    remainingBudget
  )

  const oneTime = formatMoney(
    destinationCurrency,
    oneTimeExpenses
  )

  const monthly = formatMoney(
    destinationCurrency,
    monthlyExpenses
  )

  const originalSavings = formatMoney(
    originCurrency,
    savings
  )

  const plannedPercentage =
    Number(result) > 0
      ? (Number(totalExpenses) / Number(result)) * 100
      : 0

  const progressPercentage = Math.min(
    Math.max(plannedPercentage, 0),
    100
  )

  const getRunwayDisplay = () => {
    if (typeof runway === "number" && Number.isFinite(runway)) {
      return `${runway.toFixed(1)} months`
    }

    if (runway === Infinity) {
      return "Not limited by monthly costs"
    }

    if (runway === "Over Budget" || isOverBudget) {
      return "Over Budget"
    }

    return runway || "N/A"
  }

  return (
    <section className="border-y border-white/5 bg-surface">
      {/* Summary header */}
      <div className="border-b border-white/5 px-5 py-7 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-muted">
              Financial summary
            </p>

            <h2 className="text-xl font-semibold leading-tighter tracking-tightest text-text-primary">
              Budget result
            </h2>

            <p className="max-w-xl text-sm leading-6 text-text-muted">
              Your estimated relocation position based on the current
              inputs and planned expenses.
            </p>
          </div>

          {hasKnownStatus && (
            <span
              className={`w-fit text-sm font-medium ${
                isOverBudget
                  ? "text-error"
                  : "text-success"
              }`}
            >
              {budgetStatus.label}
            </span>
          )}
        </div>

        {/* Exchange rate metadata */}
        {rate !== null && (
          <p className="mt-5 text-xs text-text-muted">
            1 {originCurrency} = {rate} {destinationCurrency}
          </p>
        )}
      </div>

      {/* Budget Bridge */}
      <div className="px-5 py-7 sm:px-7 sm:py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">

          {/* Available */}
          <div className="space-y-3 sm:border-r sm:border-white/5 sm:pr-8">
            <p className="text-sm font-medium text-text-muted">
              Available
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-text-muted">
                {convertedSavings.currency}
              </span>

              <span className="text-xl font-medium tabular-nums text-text-primary">
                {convertedSavings.value}
              </span>
            </div>

            <p className="text-xs text-text-muted">
              Converted savings
            </p>
          </div>

          {/* Planned */}
          <div className="space-y-3 sm:border-r sm:border-white/5 sm:px-8">
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

          {/* Remaining */}
          <div className="space-y-3 sm:pl-8">
            <p className="text-sm font-medium text-text-muted">
              Remaining
            </p>

            <div className="flex items-baseline gap-2">
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
            </div>

            <p className="text-xs text-text-muted">
              After planned expenses
            </p>
          </div>
        </div>

        {/* Allocation */}
        <div className="mt-9 border-t border-white/5 pt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Budget allocation
              </p>

              <p className="mt-1 text-sm text-text-muted">
                {planned.currency} {planned.value} planned{" "}
                <span className="text-white/30">/</span>{" "}
                {remaining.currency} {remaining.value} remaining
              </p>
            </div>

            <span className="text-sm font-medium tabular-nums text-text-muted">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          <div
            className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5"
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
              : `${Math.max(
                  Math.round(100 - plannedPercentage),
                  0
                )}% of available savings remains unplanned`}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border-t border-white/5 px-5 py-7 sm:px-7">
        <div className="space-y-2">
          <h3 className="text-base font-semibold leading-tight text-text-primary">
            Expense breakdown
          </h3>

          <p className="text-sm text-text-muted">
            How your planned costs are distributed.
          </p>
        </div>

        <dl className="mt-6 divide-y divide-white/5 border-y border-white/5">
          {/* Total */}
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_8rem] items-center gap-5 py-4">
            <dt className="text-sm font-medium text-text-primary">
              Total expenses
            </dt>

            <span className="justify-self-end text-xs font-medium text-text-muted">
              {planned.currency}
            </span>

            <dd className="justify-self-end text-sm font-medium tabular-nums text-text-primary">
              {planned.value}
            </dd>
          </div>

          {/* One-time */}
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_8rem] items-center gap-5 py-4">
            <dt className="text-sm text-text-muted">
              One-time expenses
            </dt>

            <span className="justify-self-end text-xs font-medium text-text-muted">
              {oneTime.currency}
            </span>

            <dd className="justify-self-end text-sm font-medium tabular-nums text-text-primary">
              {oneTime.value}
            </dd>
          </div>

          {/* Monthly */}
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_8rem] items-center gap-5 py-4">
            <dt className="text-sm text-text-muted">
              Monthly expenses
            </dt>

            <span className="justify-self-end text-xs font-medium text-text-muted">
              {monthly.currency}
            </span>

            <dd className="justify-self-end text-sm font-medium tabular-nums text-text-primary">
              {monthly.value}
            </dd>
          </div>

          {/* Remaining */}
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_8rem] items-center gap-5 py-4">
            <dt className="text-sm font-medium text-text-primary">
              Remaining budget
            </dt>

            <span className="justify-self-end text-xs font-medium text-text-muted">
              {remaining.currency}
            </span>

            <dd
              className={`justify-self-end text-sm font-medium tabular-nums ${
                isOverBudget
                  ? "text-error"
                  : "text-success"
              }`}
            >
              {remaining.value}
            </dd>
          </div>
        </dl>
      </div>

      {/* Runway insight */}
      <div className="border-t border-white/5 px-5 py-7 sm:px-7">
        <div className="max-w-xl">
          <p className="text-xs font-medium text-text-muted">
            Derived insight
          </p>

          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="text-2xl font-medium leading-tight tabular-nums text-text-primary">
              {getRunwayDisplay()}
            </span>

            <span className="text-sm text-text-muted">
              Based on monthly burn rate
            </span>
          </div>
        </div>
      </div>

      {/* Over-budget message */}
      {isOverBudget && (
        <div
          role="alert"
          className="border-t border-error/20 bg-error/4 px-5 py-4 text-sm text-error sm:px-7"
        >
          Your estimated expenses exceed your current savings.
        </div>
      )}
    </section>
  )
}

export default CalculatorSummary