function validateCurrency(currencyCode){
  currencyCode = currencyCode.toUpperCase()
  if(/^[A-Z]{3}$/.test(currencyCode)){
    return currencyCode
  }
  return false
}

export default validateCurrency