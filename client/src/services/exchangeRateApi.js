const getExchangeRate = async(from,to) => {
  const res = await fetch(`http://localhost:5000/api/exchange-rate/${from}/${to}`)
  
  const data = await res.json()
  
  if(!res.ok){
    throw new Error(data.error || "Unable to retrieve exchange rate")
  }
  
  return data
}

export default getExchangeRate



