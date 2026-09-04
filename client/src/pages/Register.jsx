import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import AuthPage from "../components/AuthPage.jsx"
import { registerUser } from "../services/authApi.js"

const Register = () => {
  const [apiError, setApiError] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      setApiError("")
      await registerUser(data)
      setIsRegistered(true)
    } catch (error) {
      setApiError(
        error?.message || "Registration failed. Please try again."
      )
    }
  }

  const fieldClassName = (hasError) =>
    `w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 ${
      hasError
        ? "border-error focus:border-error focus:ring-error/30"
        : "border-input-border focus:border-primary focus:ring-primary/30"
    }`

  if (isRegistered) {
    return (
      <AuthPage
        title="Account created"
        description="Your registration was successful. You can now sign in with your credentials."
      >
        <div className="space-y-4">
          <div
            role="status"
            className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success"
          >
            Your account has been created successfully.
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          >
            Proceed to login
          </Link>
        </div>
      </AuthPage>
    )
  }

  return (
    <AuthPage
      title="Create your account"
      description="Start tracking your relocation expenses and savings."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Log in"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)}
        noValidate 
        className="space-y-5">
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
            htmlFor="name"
            className="block text-sm font-medium text-text-primary"
          >
            Full name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClassName(Boolean(errors.name))}
            {...register("name", {
              required: "Full name is required",
              onChange: () => {
                if (apiError) setApiError("")
              },
            })}
          />

          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-sm text-error"
            >
              {errors.name.message}
            </p>
          )}
        </div>

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
              required: "Email address is required",
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
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={fieldClassName(Boolean(errors.password))}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
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
              <span>Creating account...</span>
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </AuthPage>
  )
}

export default Register