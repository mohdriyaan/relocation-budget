const getExchangeRate = async(from,to) => {
  const res = await fetch(`http://localhost:5000/api/exchange-rate/${from}/${to}`)
  const data = await res.json()
  return data
}

export default getExchangeRate



