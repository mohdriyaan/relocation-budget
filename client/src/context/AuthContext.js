import { createContext, useContext, useEffect, useState } from "react"
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser
} from "../services/authApi.js"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
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

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

export { AuthProvider, useAuth }