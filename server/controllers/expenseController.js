import Expense from "../models/Expense.js"
const getExpenses = async(req,res) => {
  try {
    const expenses = await Expense.findOne({
      user : req.user
    })

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
    const newExpense = new Expense({
      ...req.body,
      user : req.user
    })
    const saveExpense = await newExpense.save()

    return res.status(201).json({
      expense : saveExpense
    })
    
  } catch (error) {
    if(error.name==="ValidationError"){
      return res.status(400).json({
        error : "Invalid inputs",
      })
    }
    return res.status(500).json({
      error : "Unable to create expense"
    })
  }
}

const deleteExpense = async(req, res) => {
  try {
    const expenseId = req.params.id
    const userId = req.user

    const expense = await Expense.findOneAndDelete({
      _id : expenseId,
      user : userId
    })

    if(!expense){
      return res.status(404).json({
        error : "Valid ID but expense not found"
      })
    }

    return res.status(200).json({
      message : "Expense has been deleted successfully"
    })
    
  } catch (error) {
    if(error.name==="CastError"){
      return res.status(400).json({
        error : "Invalid Id format"
      })
    }
    return res.status(500).json({
      error : "Unable to delete expense"
    })
  }
}

const updateExpense = async(req,res)=> {
  try {
    const expenseId = req.params.id
    const userId = req.user
    const expenseData = req.body

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id : expenseId,
        user : userId
      },
      expenseData,
      {new : true, runValidators: true}
    )

    if(!updatedExpense){
      return res.status(404).json({
        error : "Valid ID but expense not found"
      })
    }

    return res.status(200).json({
      expense : updatedExpense
    })
  } catch (error) {
    if(error.name==="ValidationError"){
      return res.status(400).json({
        error : "Invalid inputs"
      })
    }
    if(error.name==="CastError"){
      return res.status(400).json({
        error : "Invalid Id format"
      })
    }
    return res.status(500).json({
      error : "Unable to Update expense"
    })
  }
}

export {getExpenses, createExpenses, deleteExpense, updateExpense}