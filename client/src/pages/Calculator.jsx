// pages/Calculator.jsx
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
    isCalculating
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
      setExpensesLoadError(error.message || "Unable to get expenses")
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
        getBudgetData()
      ])
    }

    loadCalculatorData()
  }, [])

  function addExpense(expenseData) {
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      expenseData
    ])

    invalidateCalculation()
  }

  async function handleDeleteExpense(idToDelete) {
    try {
      setDeleteError(null)

      await deleteExpense(idToDelete)

      setExpenses((prevExpenses) => (
        prevExpenses.filter(
          (expense) => expense._id !== idToDelete
        )
      ))

      invalidateCalculation()
    } catch (error) {
      setDeleteError(error.message || "Unable to delete expense")
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
      destinationCurrency: data.destinationCurrency
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-canvas px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* Header Section */}
        <header className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Relocation budget calculator
          </h1>

          <p className="text-sm leading-6 text-text-muted sm:text-base">
            Convert your savings, estimate your planned costs, and understand your
            remaining budget before you relocate.
          </p>
        </header>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Currency Conversion Form */}
          <div className="lg:col-span-5 space-y-6">
            <CalculatorForm
              onCalculate={handleCalculate}
              onDestinationCurrencyChange={setDestinationCurrency}
              exchangeRateError={exchangeRateError}
              calculationError={calculationError}
              isCalculating={isCalculating}
              initialBudget={initialBudget}
              hasCalculated={showSummary && result!== null}
            />

            {/* Direct Summary Render */}
            {showSummary && result !== null && calculationData && (
              <div className="pt-6 border-t border-slate-800">
                <CalculatorSummary
                  originCurrency={calculationData.originCurrency}
                  destinationCurrency={calculationData.destinationCurrency}
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
                    className="text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    Back to Dashboard 
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Expense Management */}
          <div className="lg:col-span-7 space-y-6">
            {/* Add Expense Card */}
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
      </div>
    </div>
  )
}

export default Calculator