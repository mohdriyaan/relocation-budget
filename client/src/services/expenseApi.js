async function createExpense(expenseData){
  try {
    const res = await fetch("http://localhost:5000/api/expenses",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(expenseData)
    })
    
    
    if(!res.ok){
      throw new Error(`Failed to create expense`)
    }

    const result = await res.json()
    return result

  } catch (error) {
    console.log("Error:", error )
  }
}

export default createExpense