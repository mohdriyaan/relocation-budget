import express from "express"
import { getExpenses, createExpenses, deleteExpense } from "../controllers/expenseController.js"
const router = express.Router()

router.get("/",getExpenses)
router.post("/",createExpenses)
router.delete("/:id",deleteExpense)

export default router
