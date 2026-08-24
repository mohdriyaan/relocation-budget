const calculateMonthlyExpenses = (expenses) => {
  return expenses.reduce((acc,current)=>{
    if(current.frequency==="monthly"){
      return acc + Number(current.amount)
    }
    return acc
  },0)
}

export default calculateMonthlyExpenses