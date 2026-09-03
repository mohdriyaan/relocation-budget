import { useEffect, useState } from "react"
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser
} from "../services/authApi.js"
import AuthContext from "./authContext.js"

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (userDetails) => {
    const result = await loginApi(userDetails)
    setUser(result.user)
    return result
  }

  const logout = async () => {
    const result = await logoutApi()
    setUser(null)
    return result
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
