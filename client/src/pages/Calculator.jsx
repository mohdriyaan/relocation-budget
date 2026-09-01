// pages/Calculator.jsx
import { useState, useEffect } from "react"
import useBudgetCalculator from "../hooks/useBudgetCalculator.js"
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import { getExpenses, deleteExpense } from "../services/expenseApi.js"
import CalculatorForm from "../components/CalculatorForm.jsx"
import ExpenseSection from "../components/ExpenseSection.jsx"

const Calculator = () => {
  const [expenses, setExpenses] = useState([])

  const {
    formData,
    errors,
    changeHandler,
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

  useEffect(() => {
    getExpensesData()
  }, [])

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

  function addExpense(expenseData) {
    const newExpense = {
      id: crypto.randomUUID(),
      ...expenseData
    }

    setExpenses((prevExpenses) => [
      ...prevExpenses,
      newExpense
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

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exchange & Budget Calculator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Convert currency savings and track upcoming trip or relocation expenses in one place.
          </p>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Currency Conversion Form */}
          <div className="lg:col-span-5 space-y-6">
            <CalculatorForm
              formData={formData}
              errors={errors}
              changeHandler={changeHandler} handleSubmit={handleSubmit}
              exchangeRateError={exchangeRateError}
              calculationError={calculationError}
              isCalculating={isCalculating}
            />

            {/* Direct Summary Render */}
            {showSummary && result !== null && (
              <div className="pt-6 border-t border-slate-800">
                <CalculatorSummary
                  originCurrency={formData.originCurrency}
                  destinationCurrency={formData.destinationCurrency}
                  savings={formData.savings}
                  result={result}
                  totalExpenses={totalExpenses}
                  rate={exchangeRate}
                  remainingBudget={remainingBudget}
                  oneTimeExpenses={oneTimeExpenses}
                  monthlyExpenses={monthlyExpenses}
                  runway={runway}
                />
              </div>
            )}
          </div>

          {/* Right Column: Expense Management */}
          <div className="lg:col-span-7 space-y-6">
            {/* Add Expense Card */}
            <ExpenseSection
              addExpense={addExpense}
              destinationCurrency={formData.destinationCurrency}
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