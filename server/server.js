import express from "express"
import healthRoute from "./routes/healthRoutes.js"

const app = express()
const PORT = 5000

app.use(express.json())

app.get("/",(req,res)=>{
  res.send("Relocation Budget API")
})

app.use("/api/health",healthRoute)

app.listen(PORT,()=>{
  console.log(`Server started running on ${PORT}`)
})