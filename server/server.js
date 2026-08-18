import express from "express"
import connectToDB from "./db/connectDB.js"
import dotenv from "dotenv"
import ratesRouter from "./routes/rates.js" 

dotenv.config()
connectToDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use("/api/v1/budget",ratesRouter)

app.listen(PORT,()=>{
  console.log(`Server started running on ${PORT}`)
})

