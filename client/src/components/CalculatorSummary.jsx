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

  const runwayDisplay = getRunwayDisplay()

  const formatMoney = (currency, amount) =>
    `${currency} ${formatCurrency(Number(amount))}`

  return (
    <section className="rounded-xl border border-divider bg-surface p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          Budget result
        </h2>

        <p className="text-sm text-text-muted">
          Your estimated relocation position based on the current inputs.
        </p>
      </div>

      <div className="mt-7 border-y border-divider py-6">
        <p className="text-sm font-medium text-text-muted">
          Converted savings
        </p>

        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-text-primary sm:text-4xl">
          {formatMoney(destinationCurrency, result)}
        </p>

        <p className="mt-2 text-sm text-text-muted">
          {formatMoney(originCurrency, savings)} at 1 {originCurrency} ={" "}
          {rate} {destinationCurrency}
        </p>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Budget position
            </h3>

            <p className="mt-1 text-sm text-text-muted">
              Planned expenses against your converted savings.
            </p>
          </div>

          {hasKnownStatus && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${isOverBudget
                  ? "border-error/40 bg-error/10 text-error"
                  : "border-success/40 bg-success/10 text-success"
                }`}
            >
              <span aria-hidden="true">
                {isOverBudget ? "!" : "✓"}
              </span>
              <span>{budgetStatus.label}</span>
            </span>
          )}
        </div>

        <dl className="mt-5 divide-y divide-divider border-y border-divider">
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-text-muted">Total expenses</dt>
            <dd className="text-sm font-semibold tabular-nums text-text-primary">
              {formatMoney(destinationCurrency, totalExpenses)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-text-muted">One-time expenses</dt>
            <dd className="text-sm font-semibold tabular-nums text-text-primary">
              {formatMoney(destinationCurrency, oneTimeExpenses)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-text-muted">Monthly expenses</dt>
            <dd className="text-sm font-semibold tabular-nums text-text-primary">
              {formatMoney(destinationCurrency, monthlyExpenses)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm font-medium text-text-primary">
              Remaining budget
            </dt>
            <dd
              className={`text-sm font-semibold tabular-nums ${isOverBudget ? "text-error" : "text-success"
                }`}
            >
              {formatMoney(destinationCurrency, remainingBudget)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-7 rounded-lg border border-divider bg-canvas px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Estimated runway
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
              {runwayDisplay}
            </p>
          </div>

          <span className="text-sm text-text-muted">
            Based on monthly expenses
          </span>
        </div>
      </div>

      {isOverBudget && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
        >
          Your estimated expenses exceed your current savings.
        </div>
      )}
    </section>
  )
}

export default CalculatorSummary