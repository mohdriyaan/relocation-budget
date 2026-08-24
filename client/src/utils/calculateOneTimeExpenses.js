const calculateOneTimeExpenses = (expenses) => {
  return expenses.reduce((acc,current)=>{
    if(current.frequency==="one-time"){
      return acc + Number(current.amount)
    }
    return acc
  },0)
}

export default calculateOneTimeExpenses
