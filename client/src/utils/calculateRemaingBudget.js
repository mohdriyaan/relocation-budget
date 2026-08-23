import calculateTotalExpenses from "./calculateTotalExpenses.js"

const calculateRemainingBudget = (savings,totalExpenses) => {
  return Number(savings) - Number(totalExpenses)
}

export default calculateRemainingBudget