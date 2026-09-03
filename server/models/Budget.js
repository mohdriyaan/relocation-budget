import mongoose from "mongoose"
import supportedCurrencies from "../constants/currencies.js"

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  savings: {
    type: Number,
    required: [true, "Savings is required"],
    min: [0.01, "Savings must be greater than 0"]
  },

  originCurrency: {
    type: String,
    required: [true, "Origin currency is required"],
    uppercase: true,
    trim: true,
    enum: {
      values: supportedCurrencies,
      message: "Origin currency is not supported"
    }
  },

  destinationCurrency: {
    type: String,
    required: [true, "Destination currency is required"],
    uppercase: true,
    trim: true,
    enum: {
      values: supportedCurrencies,
      message: "Destination currency is not supported"
    }
  }
},
  {
    timestamps: true
  }
)

const Budget = mongoose.model("Budget", budgetSchema)

export default Budget