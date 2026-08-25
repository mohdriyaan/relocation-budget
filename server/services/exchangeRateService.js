async function getExchangeRate(from,to){
  const res = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}`);
  const data = await res.json();
  return data.rate
}


export default getExchangeRate
