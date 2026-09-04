import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import AuthPage from "../components/AuthPage.jsx"
import useAuth from "../hooks/useAuth.js"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      setApiError("")
      await login(data)
      navigate("/")
    } catch (error) {
      setApiError(
        error?.message || "Invalid email or password"
      )
    }
  }

  const fieldClassName = (hasError) =>
    `w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 ${
      hasError
        ? "border-error focus:border-error focus:ring-error/30"
        : "border-input-border focus:border-primary focus:ring-primary/30"
    }`

  return (
    <AuthPage
      title="Welcome back"
      description="Sign in to access your budget and expenses."
      footerText="Don't have an account?"
      footerLink="/register"
      footerLabel="Register"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)}
        noValidate 
        className="space-y-5"
      >
        {apiError && (
          <div
            role="alert"
            className="rounded-lg border border-error/40 bg-error/10 px-3.5 py-3 text-sm text-error"
          >
            {apiError}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClassName(Boolean(errors.email))}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
              onChange: () => {
                if (apiError) setApiError("")
              },
            })}
          />

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-sm text-error"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-primary"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={fieldClassName(Boolean(errors.password))}
            {...register("password", {
              required: "Password is required",
              onChange: () => {
                if (apiError) setApiError("")
              },
            })}
          />

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-error"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              <span>Logging in...</span>
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </AuthPage>
  )
}

export default Login