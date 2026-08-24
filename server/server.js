import express from "express"

const app = express()
const PORT = 5000 

app.get("/",(req,res)=>{
  res.send("Relocation Budget API")
})

app.listen(PORT,()=>{
  console.log(`Server started running on ${PORT}`)
})