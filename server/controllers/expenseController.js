import Expense from "../models/Expense.js"
const getExpenses = async(req,res) => {
  try {
    const expenses = await Expense.find()

    return res.status(200).json({
      expenses
    })

  } catch (error) {
    return res.status(500).json({
      error : error.message
    })
  }
  
}

export default getExpenses