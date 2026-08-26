async function getExchangeRate(from,to){
  const res = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}`);
  if(res.ok){
    const data = await res.json();
    return data
  }
  return false
}


export default getExchangeRate
