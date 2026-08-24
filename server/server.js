import express from "express"

const app = express()
const PORT = 5000

app.use(express.json())

app.get("/",(req,res)=>{
  res.send("Relocation Budget API")
})

app.get("/api/health",(req,res)=>{
  res.json({
    status: "ok",
    message: "Relocation Budget API is running"
  })
})

app.listen(PORT,()=>{
  console.log(`Server started running on ${PORT}`)
})