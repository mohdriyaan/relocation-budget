import express from "express"
import { getBudget, createOrUpdateBudget } from "../controllers/budgetController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getBudget)
router.post("/", createOrUpdateBudget)

export default router