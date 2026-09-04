import { useState, useEffect } from "react"
import useBudgetCalculator from "../hooks/useBudgetCalculator.js"
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import { getExpenses, deleteExpense } from "../services/expenseApi.js"
import { getBudget, saveBudget } from "../services/budgetApi.js"
import CalculatorForm from "../components/CalculatorForm.jsx"
import ExpenseSection from "../components/ExpenseSection.jsx"
import { Link } from "react-router-dom"

const Calculator = () => {
  const [expenses, setExpenses] = useState([])
  const [initialBudget, setInitialBudget] = useState(null)
  const [destinationCurrency, setDestinationCurrency] = useState("NZD")

  const {
    calculationData,
    handleSubmit,
    showSummary,
    result,
    exchangeRate,
    exchangeRateError,
    calculationError,
    totalExpenses,
    oneTimeExpenses,
    monthlyExpenses,
    remainingBudget,
    runway,
    invalidateCalculation,
    isCalculating,
  } = useBudgetCalculator(expenses)

  const [isExpensesLoading, setIsExpensesLoading] = useState(true)
  const [expensesLoadError, setExpensesLoadError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)

  async function getExpensesData() {
    try {
      setIsExpensesLoading(true)

      const result = await getExpenses()

      if (result.expenses) {
        setExpenses(result.expenses)
        setExpensesLoadError(null)
      }
    } catch (error) {
      setExpensesLoadError(
        error.message || "Unable to get expenses"
      )
    } finally {
      setIsExpensesLoading(false)
    }
  }

  async function getBudgetData() {
    try {
      const result = await getBudget()
      setInitialBudget(result.budget)
    } catch (error) {
      if (error.message !== "Budget not found") {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const loadCalculatorData = async () => {
      await Promise.all([
        getExpensesData(),
        getBudgetData(),
      ])
    }

    loadCalculatorData()
  }, [])

  function addExpense(expenseData) {
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      expenseData,
    ])

    invalidateCalculation()
  }

  async function handleDeleteExpense(idToDelete) {
    try {
      setDeleteError(null)

      await deleteExpense(idToDelete)

      setExpenses((prevExpenses) =>
        prevExpenses.filter(
          (expense) => expense._id !== idToDelete
        )
      )

      invalidateCalculation()
    } catch (error) {
      setDeleteError(
        error.message || "Unable to delete expense"
      )

      throw error
    }
  }

  function handleUpdateExpense(updatedExpense) {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id
          ? updatedExpense
          : expense
      )
    )

    invalidateCalculation()
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense)
  }

  function onEditComplete() {
    setEditingExpense(null)
  }

  function handleCancelEdit() {
    setEditingExpense(null)
  }

  async function handleCalculate(data) {
    await handleSubmit(data)

    await saveBudget({
      savings: Number(data.savings),
      originCurrency: data.originCurrency,
      destinationCurrency: data.destinationCurrency,
    })
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-canvas px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl space-y-14">
        {/* Header */}
        <header className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold leading-tighter tracking-tightest text-text-primary sm:text-5xl">
            Relocation budget calculator
          </h1>

          <p className="max-w-2xl text-base leading-7 text-text-muted">
            Convert your savings, estimate your planned costs,
            and understand your remaining budget before you
            relocate.
          </p>
        </header>

        {/* Calculator workspace */}
        <div className="space-y-10">
          {/* Working area */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Calculator form */}
            <div className="lg:col-span-5">
              <CalculatorForm
                onCalculate={handleCalculate}
                onDestinationCurrencyChange={
                  setDestinationCurrency
                }
                exchangeRateError={exchangeRateError}
                calculationError={calculationError}
                isCalculating={isCalculating}
                initialBudget={initialBudget}
                hasCalculated={
                  showSummary && result !== null
                }
              />
            </div>

            {/* Expense ledger */}
            <div className="lg:col-span-7">
              <ExpenseSection
                addExpense={addExpense}
                destinationCurrency={destinationCurrency}
                editingExpense={editingExpense}
                onUpdateExpense={handleUpdateExpense}
                onEditComplete={onEditComplete}
                onCancelEdit={handleCancelEdit}
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
                onEditExpense={handleEditExpense}
                isLoading={isExpensesLoading}
                error={expensesLoadError}
                deleteError={deleteError}
              />
            </div>
          </div>

          {/* Financial report */}
          {showSummary && result !== null && calculationData && (
            <section className="border-t border-border-subtle pt-12">
              <CalculatorSummary
                originCurrency={calculationData.originCurrency}
                destinationCurrency={
                  calculationData.destinationCurrency
                }
                savings={calculationData.savings}
                result={result}
                totalExpenses={totalExpenses}
                rate={exchangeRate}
                remainingBudget={remainingBudget}
                oneTimeExpenses={oneTimeExpenses}
                monthlyExpenses={monthlyExpenses}
                runway={runway}
              />

              <div className="mt-6 flex justify-end">
                <Link
                  to="/"
                  className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Back to Dashboard
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

export default Calculator