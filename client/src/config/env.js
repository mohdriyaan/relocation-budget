const developmentApiUrl = "http://localhost:5000/api"

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? developmentApiUrl : "")

if(!API_BASE_URL){
  throw new Error(
    "VITE_API_BASE_URL must be configured for production."
  )
}

export default API_BASE_URL