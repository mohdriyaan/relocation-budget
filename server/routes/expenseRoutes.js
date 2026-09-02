import express from "express"
import { getExpenses, createExpenses, deleteExpense, updateExpense } from "../controllers/expenseController.js"
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router()

// Protect all routes defined below in this router
router.use(authMiddleware)

// Collection routes
router.route("/")
  .get(getExpenses)
  .post(createExpenses)

// Individual resource routes
router.route("/:id")
  .patch(updateExpense)
  .delete(deleteExpense)

export default router
