async function getExchangeRate(from,to){
  try{
    const res = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}`);
  
    if(!res.ok){
      throw new Error("Exchange rate provider unavailable")
    }

    const data = await res.json();
    
    return data.rate

  } catch (error) {
    throw new Error("Unable to retrieve exchange rate")
  }
}

export default getExchangeRate
