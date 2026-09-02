// client/src/pages/Login.jsx
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data) => {
    try {
      setApiError("")
      await login(data)
      navigate("/calculator")
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        error.message || 
        "Invalid email or password"
      )
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to access your budget and expenses
          </p>
        </div>

        {apiError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address"
                },
                onChange: () => apiError && setApiError("")
              })}
              className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
                  : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.email && (
              <span className="mt-2 text-xs text-rose-400 flex items-center gap-1 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                onChange: () => apiError && setApiError("")
              })}
              className={`w-full bg-slate-950 text-white text-sm rounded-lg p-3 placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border border-rose-500 focus:border-rose-500 focus:ring-rose-500/40"
                  : "border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.password && (
              <span className="mt-2 text-xs text-rose-400 flex items-center gap-1 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login