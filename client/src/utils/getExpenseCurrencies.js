function getExpenseCurrencies(expenses, destinationCurrency) {
  const currencies = expenses
    .map((expense) => expense.currency)
    .filter((currency) => currency !== destinationCurrency)

  return [...new Set(currencies)]
}

export default getExpenseCurrencies