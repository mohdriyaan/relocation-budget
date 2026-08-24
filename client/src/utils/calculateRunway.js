const calculateRunway = (remainingBudget, monthlyExpenses) => {
  if(monthlyExpenses===0){
    return "No monthly expenses"
  }

  if(remainingBudget < 0){
    return "Over Budget"
  }

  return remainingBudget / monthlyExpenses
}

export default calculateRunway