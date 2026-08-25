import validateCurrency from "../utils/validateCurrency.js"

const currencyController = (req,res) => {
  const currency = validateCurrency(req.params.code)

  if(currency){
    return res.status(200).json({
      currency
    })
  }
  return res.status(400).json({
    error : "Invalid currency"  
  })
  
}

export default currencyController