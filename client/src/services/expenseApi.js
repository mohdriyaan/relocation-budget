async function createExpense(expenseData){
  try {
    const res = await fetch("http://localhost:5000/api/expenses",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(expenseData)
    })
    
    if (!res.ok){
      throw new Error("Unable to create Expense")
    }

    const result = await res.json()
    return result

  } catch (error) {
    throw error
  }
}

async function getExpenses(){
  try {
    const res = await fetch("http://localhost:5000/api/expenses",{
      method : "GET",
    })
    
    if (!res.ok){
      throw new Error("Unable to get Expenses")
    }

    const result = await res.json()
    return result

  } catch (error) {
    throw error
  }
}

async function deleteExpense(id){
  try {
    const res = await fetch(`http://localhost:5000/api/expenses/${id}`,{
      method : "DELETE"
    })
    
    if (!res.ok){
      throw new Error("Unable to delete Expenses")
    }

    const result = await res.json()
    return result

  } catch (error) {
    throw error
  }
}

async function updateExpense(id, expenseData){
  try {
    const res = await fetch(`http://localhost:5000/api/expenses/${id}`,{
      method : "PATCH",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(expenseData)
    })
    
    if (!res.ok){
      throw new Error("Unable to update Expenses")
    }

    const result = await res.json()
    return result

  } catch (error) {
    throw error
  }
}


export {createExpense, getExpenses, deleteExpense, updateExpense}