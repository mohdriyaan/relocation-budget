async function createExpense(expenseData) {
  const res = await fetch("http://localhost:5000/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData)
  })

  const result = res.json()

  if (!res.ok) {
    throw new Error(result.error || result.message || "Unable to create expense")
  }

  return result
}

async function getExpenses() {
  const res = await fetch("http://localhost:5000/api/expenses", {
    method: "GET",
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || result.message || "Unable to get expense")
  }

  return result
}

async function deleteExpense(id) {
  const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: "DELETE"
  })

  const result = res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to delete expense")
  }

  return result
}

async function updateExpense(id, expenseData) {
  const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData)
  })

  const result = res.json()

  if (!res.ok) {
    throw new Error(result.error || result.message || "Unable to update expense")
  }

  return result
}


export { createExpense, getExpenses, deleteExpense, updateExpense }