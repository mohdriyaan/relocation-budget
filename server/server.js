import "dotenv/config"
import express from "express"
import healthRoute from "./routes/healthRoutes.js"
import currencyRoute from "./routes/currencyRoutes.js"
import exchangeRateRoute from "./routes/exchangeRateRoutes.js"
import expenseRoute from "./routes/expenseRoutes.js"
import budgetRoute from "./routes/budgetRoute.js"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use(cookieParser())

app.get("/",(req,res)=>{
  res.send("Relocation Budget API")
})

app.use("/api/health",healthRoute)
app.use("/api/currency",currencyRoute)
app.use("/api/exchange-rate",exchangeRateRoute)
app.use("/api/expenses",expenseRoute)
app.use("/api/auth", authRoute)
app.use("/api/budget",budgetRoute)

async function startServer(){
  await connectDB()
  
  app.listen(PORT,()=>{
    console.log(`Server started running on ${PORT}`)
  })
}

startServer()
