import mongoose from "mongoose"
import supportedCurrencies from "../constants/currencies.js"

const expenseSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, "Name is required"],
    trim : true
  },
  category : {
    type : String,
    required : [true, "Category is required"],
    trim : true
  },
  amount : {
    type : Number,
    required : [true, "Amount is required"],
    min : 0.01
  },
  currency : {
    type : String,
    required : [true, "Currency is required"],
    minlength : 3,
    enum : {
      values : supportedCurrencies
    },
    uppercase : true
  },
  frequency : {
    type : String,
    required : [true, "Frequency is required"],
    enum : ["one-time","monthly"],
    default : "one-time"
  },
  notes : {
    type : String,
    required : false,
    trim : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  } 
}, {
  timestamps : true
})

const Expense = mongoose.model("Expense",expenseSchema)

export default Expense
