import express from "express"
import { getExpenses, createExpenses, deleteExpense, updateExpense } from "../controllers/expenseController.js"
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router()

router.get("/", authMiddleware, getExpenses)
router.post("/", authMiddleware, createExpenses)
router.delete("/:id", authMiddleware, deleteExpense)
router.patch("/:id", authMiddleware, updateExpense)

export default router
