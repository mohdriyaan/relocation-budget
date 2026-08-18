import mongoose from "mongoose";

const budgetItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  category: { type: String, enum: ['tuition', 'living', 'visa', 'flight', 'other'], default: 'other' },
  destination: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const BudgetItem = mongoose.model("BudgetItem",budgetItemSchema)

export default BudgetItem

