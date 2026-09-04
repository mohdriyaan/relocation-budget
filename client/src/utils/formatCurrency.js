function formatCurrency(numericAmount){  
  return new Intl.NumberFormat(
    "en-US", 
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(numericAmount || 0)
} 

export default formatCurrency

