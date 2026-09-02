import API_BASE_URL from "../config/env.js"

async function createExpense(expenseData) {
  const res = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData),
    credentials : "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to create expense")
  }

  return result
}

async function getExpenses() {
  const res = await fetch(`${API_BASE_URL}/expenses`, {
    method: "GET",
    credentials : "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to get expense")
  }

  return result
}

async function deleteExpense(id) {
  const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
    credentials : "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to delete expense")
  }

  return result
}

async function updateExpense(id, expenseData) {
  const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData),
    credentials : "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to update expense")
  }

  return result
}


export { createExpense, getExpenses, deleteExpense, updateExpense }