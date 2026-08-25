import express from "express"
import exchangeRateController from "../controllers/exchangeRateController.js"

const router = express.Router()

router.get("/:from/:to",exchangeRateController)

export default router
