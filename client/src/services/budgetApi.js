import API_BASE_URL from "../config/env.js"

const getBudget = async () => {
  const res = await fetch(`${API_BASE_URL}/budget`, {
    method: "GET",
    credentials: "include"
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to retrieve budget")
  }

  return result
}

const saveBudget = async (budgetData) => {
  const res = await fetch(`${API_BASE_URL}/budget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(budgetData)
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || "Unable to save budget")
  }

  return result
}

export { getBudget, saveBudget }