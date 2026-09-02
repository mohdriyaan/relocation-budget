import {z} from "zod"
import currencyList from "../data/currencies.js"


const CalculatorSchema = z
  .object({
    originCurrency : z
      .string()
      .refine(
        (value)=> currencyList.includes(value),
        "Must be a valid currency"
      ),

    destinationCurrency : z
      .string()
      .refine(
        (value) => currencyList.includes(value),
        "Must be a valid currency"
      ),
    
    savings : z
      .string()
      .trim()
      .min(1, "Savings should not be empty")
      .refine(
        (value) => Number(value) > 0,
        "Savings should be greater than 0"
      )
  })
  .refine(
    (data) => data.originCurrency !== data.destinationCurrency,
    {
      message : "Same currency selected - no conversion required",
      path : ["destinationCurrency"]
    }
  )

export default CalculatorSchema