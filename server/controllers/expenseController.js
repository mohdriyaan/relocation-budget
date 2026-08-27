import Expense from "../models/Expense.js"
const getExpenses = async(req,res) => {
  try {
    const expenses = await Expense.find()

    return res.status(200).json({
      expenses
    })

  } catch (error) {
    return res.status(500).json({
      error : "Unable to retrieve expenses."
    })
  }
}

const createExpenses = async(req,res) => {
  try {
    const newExpense = new Expense(req.body)
    const saveExpense = await newExpense.save()

    return res.status(201).json({
      expense : saveExpense
    })
    
  } catch (error) {
    if(error.name==="ValidationError"){
      return res.status(400).json({
        error : "Invalid inputs"
      })
    }
    return res.status(500).json({
      error : "Cannot create expense"
    })
  }
}

export {getExpenses, createExpenses}