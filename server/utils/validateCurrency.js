import supportedCurrencies from "../constants/currencies.js"

function validateCurrency(currencyCode){
  if(!currencyCode){
    return false
  }

  const normalizedCurrency = currencyCode.toUpperCase()

  return supportedCurrencies.includes(normalizedCurrency)
    ? normalizedCurrency
    : false
}

export default validateCurrency