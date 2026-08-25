const currencyController = (req,res) => {
  const currency = req.params.code
  res.json({
    currency
  })
}

export default currencyController