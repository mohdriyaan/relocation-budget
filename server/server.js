import express from "express"
import healthRoute from "./routes/healthRoutes.js"
import currencyRoute from "./routes/currencyRoutes.js"
import exchangeRateRoute from "./routes/exchangeRateRoutes.js"
import cors from "cors"

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors({
  origin : "http://localhost:5173"
}))

app.get("/",(req,res)=>{
  res.send("Relocation Budget API")
})

app.use("/api/health",healthRoute)
app.use("/api/currency",currencyRoute)
app.use("/api/exchange-rate",exchangeRateRoute)

app.listen(PORT,()=>{
  console.log(`Server started running on ${PORT}`)
})