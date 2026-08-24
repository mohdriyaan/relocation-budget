const healthController = (req,res) => {
  return res.json({
    status: "ok",
    message: "Relocation Budget API is running"
  })
}

export default healthController