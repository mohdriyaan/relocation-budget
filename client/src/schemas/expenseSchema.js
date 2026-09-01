import zod from "zod"
import expenseCategories from "../data/expenseCategories.js"
import currencyList from "../data/currencies.js"

const ExpenseSchema = zod.object({
  name : zod.trim().string().min(1, "Name is required"),
  category : zod.enum(expenseCategories, {
    errorMap : () => ({message : "Must be a valid expense category"})
  }),
  amount : zod.number().positive("Amount must be greater than 0"),
  currency : zod.enum(currencyList, {
    errorMap : () => ({message : "Must be a valid currency"})
  }),
  frequency: z.enum(["one-time", "monthly"], {
    errorMap: () => ({ message: "Frequency must be either 'one-time' or 'monthly'" }),
  }),
  notes : zod.string().optional()
})

export default ExpenseSchema