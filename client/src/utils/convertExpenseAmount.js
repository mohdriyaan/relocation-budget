function convertExpenseAmount(amount, fromCurrency, toCurrency, rate){
  if(fromCurrency===toCurrency){
    return amount
  }
  return amount * rate
}

export default convertExpenseAmount