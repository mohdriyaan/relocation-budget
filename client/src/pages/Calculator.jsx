// pages/Calculator.jsx
import useBudgetCalculator from "../hooks/useBudgetCalculator.js"
import CalculatorSummary from "../components/CalculatorSummary.jsx"
import calculateTotalExpenses from "../utils/calculateTotalExpenses.js"
import calculateMonthlyExpenses from "../utils/calculateMonthlyExpenses.js"
import calculateOneTimeExpenses from "../utils/calculateOneTimeExpenses.js"
import calculateRemainingBudget from "../utils/calculateRemainingBudget.js"
import calculateRunway from "../utils/calculateRunway.js"
import getExchangeRate from "../services/exchangeRateApi.js"
import { getExpenses, deleteExpense } from "../services/expenseApi.js"
import getExpenseCurrencies from "../utils/getExpenseCurrencies.js"
import getExpenseRates from "../utils/getExpenseRates.js"
import convertExpenses from "../utils/convertExpenses.js"
import CalculatorForm from "../components/CalculatorForm.jsx"
import ExpenseSection from "../components/ExpenseSection.jsx"

const Calculator = () => {
  const {
    formData,
    errors,
    changeHandler,
    convertAmount,
    normalizeExpenses,
    fetchRate,
    handleSubmit
  } = useBudgetCalculator()

  const [showSummary, setShowSummary] = useState(false)

  const [result, setResult] = useState(null)

  const [expenses, setExpenses] = useState([])

  const [exchangeRate, setExchangeRate] = useState(null)

  const [isRateLoading, setIsRateLoading] = useState(false)

  const [isExpensesLoading, setIsExpensesLoading] = useState(true)

  const [exchangeRateError, setExchangeRateError] = useState(null)

  const [expensesLoadError, setExpensesLoadError] = useState(null)

  const [editingExpense, setEditingExpense] = useState(null)

  const [normalizedExpenses, setNormalizedExpenses] = useState([])

  const [convertedSavings, setConvertedSavings] = useState(null)

  const [calculationError, setCalculationError] = useState("")

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
      setExpensesLoadError("Unable to get expenses")
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
      await deleteExpense(idToDelete)

      setExpenses((prevExpenses) => (
        prevExpenses.filter(
          (expense) => expense._id !== idToDelete
        )
      ))

      invalidateCalculation()
    } catch (error) {
      console.log(error.message)
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

  function invalidateCalculation() {
    setNormalizedExpenses([])
    setConvertedSavings(null)
    setResult(null)
    setShowSummary(false)
    setCalculationError("")
  }

  const totalExpenses = calculateTotalExpenses(normalizedExpenses)
  const oneTimeExpenses = calculateOneTimeExpenses(normalizedExpenses)
  const monthlyExpenses = calculateMonthlyExpenses(normalizedExpenses)
  const remainingBudget = calculateRemainingBudget(convertedSavings, totalExpenses)
  const runway = calculateRunway(remainingBudget, monthlyExpenses)

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
              isRateLoading={isRateLoading}
              exchangeRateError={exchangeRateError}
              calculationError={calculationError}
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator