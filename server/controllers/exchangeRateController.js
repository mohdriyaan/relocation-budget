import validateCurrency from "../utils/validateCurrency.js"

const exchangeRateRouteController = (req,res) => {
  const from = validateCurrency(req.params.from)
  const to = validateCurrency(req.params.to)

  if(from && to){
    return res.status(200).json({
      from,
      to
    })
  }

  return res.status(400).json({
    error : "One of the currency is invalid"
  })

}

export default exchangeRateRouteController