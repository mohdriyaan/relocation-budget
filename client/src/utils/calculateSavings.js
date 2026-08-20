const calculateSavings = (originCurrency,destinationCurrency,savingsInCents) => { 
  if(originCurrency===destinationCurrency){
    return savingsInCents
  }
  if(originCurrency==="INR" && destinationCurrency==="NZD"){
    const rateMultiplier = 19; 
    const rateScale = 1000;

    // Perform integer math, then use Math.round to handle the scale
    return Math.round((savingsInCents * rateMultiplier) / rateScale);
  }
  return 0
}

export default calculateSavings