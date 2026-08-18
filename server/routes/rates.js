// routes/rates.js
import express from "express"
import { getExchangedRate } from "../controllers/getExchangeRate";

const router = express.Router();

router.get('/:base', getExchangedRate);

export default router