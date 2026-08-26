import getExchangeRate from "../services/exchangeRateService.js"
import validateCurrency from "../utils/validateCurrency.js"

const exchangeRateController = async(req,res) => {
  try{
    const from = validateCurrency(req.params.from)
    const to = validateCurrency(req.params.to)

    if(from && to){
      const rate = await getExchangeRate(from,to)
      return res.status(200).json({
        from,
        to,
        rate
      })
    }

    return res.status(400).json({
      error : "One of the currency is invalid"
    })

  } catch (error){
    return res.status(502).json({
      error : error.message
    })
  }
}

export default exchangeRateController