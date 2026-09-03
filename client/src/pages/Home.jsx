import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth.js"
import useDashboardData from "../hooks/useDashboardData.js"

const Home = () => {
  const { user } = useAuth()

  const {
    budget,
    convertedSavings,
    convertedExpenses,
    remainingBudget,
    loading,
    error,
    fetchDashboardData
  } = useDashboardData()

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome Section */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-indigo-400">
            Relocation Dashboard
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Keep track of your savings, planned expenses, and relocation budget
            from one place.
          </p>

          <div className="pt-2">
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Open Calculator
            </Link>
          </div>
        </section>

        {/* Budget Overview */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Budget Overview
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Track your planned relocation expenses at a glance.
              </p>
            </div>

            {!loading && !error && budget && (
              <Link
                to="/calculator"
                className="text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Manage expenses →
              </Link>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
                >
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />

                  <div className="mt-4 h-8 w-24 animate-pulse rounded bg-slate-800" />

                  <div className="mt-3 h-3 w-40 animate-pulse rounded bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-red-300">
                    Unable to load dashboard
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !budget && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 sm:p-10">
              <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7 text-indigo-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  No budget yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                  Set up your savings and destination currency to start building your
                  relocation budget.
                </p>

                <Link
                  to="/calculator"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Set Up Budget
                </Link>
              </div>
            </div>
          )}

          {/* Budget Metrics */}
          {!loading && !error && budget && convertedSavings !== null && convertedExpenses !== null && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Total Savings */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Total Savings
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {convertedSavings.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {budget.destinationCurrency} after conversion
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-indigo-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 13h2.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Planned Expenses */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Planned Expenses
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {convertedExpenses.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {budget.destinationCurrency} converted total
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-amber-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 14.25 11.25 17l3.75-5.25"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5h15M6 4.5h12M6 4.5v15"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Remaining Budget */}
              <div
                className={`rounded-2xl border p-6 shadow-xl ${remainingBudget < 0
                  ? "border-rose-500/20 bg-rose-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Remaining Budget
                    </p>

                    <p
                      className={`mt-3 text-3xl font-bold tracking-tight ${remainingBudget < 0
                        ? "text-rose-400"
                        : "text-emerald-400"
                        }`}
                    >
                      {remainingBudget.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {budget.destinationCurrency} available
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${remainingBudget < 0
                      ? "bg-rose-500/10 ring-rose-500/20"
                      : "bg-emerald-500/10 ring-emerald-500/20"
                      }`}
                  >
                    {remainingBudget < 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 text-rose-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 17h.01"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5.25 18.75 5.29-14.03a1.55 1.55 0 0 1 2.92 0l5.29 14.03A1.55 1.55 0 0 1 17.3 21H6.7a1.55 1.55 0 0 1-1.45-2.25Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 text-emerald-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5 12 4 4L19 6"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <p
                  className={`mt-4 text-xs font-medium ${remainingBudget < 0
                    ? "text-rose-300"
                    : "text-emerald-300"
                    }`}
                >
                  {remainingBudget < 0
                    ? "You're over your available savings"
                    : "You're within your available savings"}
                </p>
              </div>

            </div>
          )}

        </section>

        {/* Getting Started */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Getting Started
            </p>

            <h2 className="text-2xl font-bold text-white">
              Build your relocation budget
            </h2>

            <p className="text-sm text-slate-400 sm:text-base">
              Start by converting your savings into your destination currency,
              then add your expected relocation and living expenses.
            </p>

            <Link
              to="/calculator"
              className="inline-flex text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Go to Calculator →
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home