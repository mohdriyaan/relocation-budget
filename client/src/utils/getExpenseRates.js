import getExchangeRate from "../services/exchangeRateApi.js"

async function getExpenseRates(currencies, destinationCurrency) {
  const results = await Promise.all(
    currencies.map(async (currency) => {
      const result = await getExchangeRate(currency, destinationCurrency)

      return {
        currency,
        rate: result.rate
      }
    })
  )

  return results.reduce((rates, item) => {
    rates[item.currency] = item.rate
    return rates
  }, {})
}

export default getExpenseRates