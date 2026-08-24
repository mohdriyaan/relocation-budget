const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((acc,current)=>(
    acc + Number(current.amount)
  ),0)
}

export default calculateTotalExpenses