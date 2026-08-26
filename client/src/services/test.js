import getExchangeRate from "./exchangeRateApi.js";

async function testRun(){
  const result = await getExchangeRate("USD","INR")
  console.log(result)
}

testRun()
