import express from "express"
import { getExpenses, createExpenses, deleteExpense, updateExpense } from "../controllers/expenseController.js"
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router()

router.use(authMiddleware)

router.get("/", getExpenses)
router.post("/", createExpenses)
router.delete("/:id", deleteExpense)
router.patch("/:id", updateExpense)

export default router
