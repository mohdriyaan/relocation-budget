import API_BASE_URL from "../config/env.js"

const getExchangeRate = async(from,to) => {
  const res = await fetch(`${API_BASE_URL}/exchange-rate/${from}/${to}`)
  
  const data = await res.json()
  
  if(!res.ok){
    throw new Error(data.error || "Unable to retrieve exchange rate")
  }
  
  return data
}

export default getExchangeRate



