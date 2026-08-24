import express from "express"

const router = express.Router()

router.get("/",(req,res)=>{
  res.json({
    status: "ok",
    message: "Relocation Budget API is running"
  })
})

export default router