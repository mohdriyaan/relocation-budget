import convertExpenseAmount from "./convertExpenseAmount"

function convertExpenses(expenses, destinationCurrency, rates){
  return expenses.map((expense)=>{
    const rate = rates[expense.currency]
    const convertedAmount = convertExpenseAmount(expense.amount, expense.currency, destinationCurrency, rate)
    return {
      ...expense,
      amount : convertedAmount,
      currency : destinationCurrency
    }
  })
}

export default convertExpenses