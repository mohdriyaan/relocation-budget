import {z} from "zod"
import expenseCategories from "../data/expenseCategories.js"
import currencyList from "../data/currencies.js"

const ExpenseSchema = z.object({
  name : z
    .string()
    .trim()
    .min(1, "Name is required"),
  
  category : z
    .string()
    .refine(
      (value) => expenseCategories.includes(value),
      "Must be a valid expense category"
    ),

  amount : z
    .number()
    .positive("Amount must be greater than 0"),

  currency : z
    .string()
    .refine(
      (value) => currencyList.includes(value),
      "Must be a valid currency"
    ),

  frequency: z
    .enum(["one-time", "monthly"]),

  notes : z
    .string()
    .optional()
})

export default ExpenseSchema