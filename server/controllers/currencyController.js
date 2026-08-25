function validateCurrency(currencyCode){
  currencyCode = currencyCode.toUpperCase()
  if(/^[A-Z]{3}$/.test(currencyCode)){
    return currencyCode
  }
  return false
}


const currencyController = (req,res) => {
  let currency = req.params.code
  currency = validateCurrency(currency)

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