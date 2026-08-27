async function createExpense(expenseData){
  try {
    const res = await fetch("http://localhost:5000/api/expenses",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(expenseData)
    })
    
    if(res.status===400){
      throw new Error(`Invalid inputs`)
    }

    if(res.status===500){
      throw new Error("Unable to create expense")
    }

    const result = await res.json()
    return result

  } catch (error) {
    throw error
  }
}

// export default createExpense
createExpense()