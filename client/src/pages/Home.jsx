import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { getExpenses } from "../services/expenseApi.js"
import { useEffect, useState } from "react"
const Home = () => {
  const { user } = useAuth()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const result = await getExpenses()

        setExpenses(result.expenses)
      } catch (error) {
        setError(error.message || "Unable to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )

  const expenseCount = expenses.length

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Section */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-indigo-400">
            Relocation Dashboard
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="max-w-2xl text-slate-400 text-sm sm:text-base">
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
          <div>
            <h2 className="text-xl font-bold text-white">
              Budget Overview
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your key relocation numbers will appear here.
            </p>
          </div>

          {loading && (
            <p className="text-sm text-slate-400">
              Loading dashboard data...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && expenses.length === 0 && (
            <p className="text-sm text-slate-400">
              You haven't added any expenses yet.
            </p>
          )}

          {!loading && !error && expenses.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Expense Count */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <p className="text-sm font-medium text-slate-400">
                  Expense Count
                </p>

                <p className="mt-3 text-2xl font-bold text-white">
                  {expenseCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total expenses added
                </p>
              </div>

              {/* Planned Expenses */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <p className="text-sm font-medium text-slate-400">
                  Planned Expenses
                </p>

                <p className="mt-3 text-2xl font-bold text-white">
                  {totalExpenses.toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total planned expenses
                </p>
              </div>

              {/* Budget Status */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <p className="text-sm font-medium text-slate-400">
                  Budget Status
                </p>

                <p className="mt-3 text-2xl font-bold text-white">
                  {expenseCount > 0 ? "Active" : "Empty"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {expenseCount > 0
                    ? "Expenses have been added"
                    : "No expenses added yet"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Getting Started */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Getting Started
            </p>

            <h2 className="text-2xl font-bold text-white">
              Build your relocation budget
            </h2>

            <p className="text-sm sm:text-base text-slate-400">
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