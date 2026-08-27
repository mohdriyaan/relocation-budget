import Expense from "../models/Expense.js"
const getExpenses = async(req,res) => {
  const expenses = await Expense.find()

  if(expenses){
    return res.status(200).json({
      expenses
    })
  }

  return res.status(404).json({
    expenses : []
  })
}

export default getExpenses