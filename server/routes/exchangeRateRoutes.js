import express from "express"
import exchangeRateRouteController from "../controllers/exchangeRateController.js"

const router = express.Router()

router.get("/:from/:to",exchangeRateRouteController)

export default router
