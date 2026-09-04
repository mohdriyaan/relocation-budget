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
    [
      "w-full",
      "rounded-lg",
      "border",
      "bg-white/[0.02]",
      "px-3",
      "py-2.5",
      "text-sm",
      "text-text-primary",
      "placeholder:text-text-muted",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
      "transition-colors",
      "focus:outline-none",
      "focus-visible:outline-none",
      "focus-visible:ring-1",
      "focus-visible:ring-white/20",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-background",
      hasError
        ? "border-error focus-visible:border-error"
        : "border-white/10 focus-visible:border-white/20",
    ].join(" ")

  const labelClassName =
    "block text-sm font-medium text-text-muted"

  if (isRegistered) {
    return (
      <AuthPage
        title="Account created"
        description="Your registration was successful. You can now sign in with your credentials."
      >
        <div className="space-y-6">
          <div
            role="status"
            className="border-y border-success/20 bg-success/3 px-4 py-4 sm:px-5"
          >
            <p className="text-sm leading-5 text-success">
              Your account has been created successfully.
            </p>
          </div>

          <div className="mt-7">
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Proceed to login
            </Link>
          </div>


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
        className="space-y-6"
      >
        {apiError && (
          <div
            role="alert"
            className="border-y border-error/25 bg-error/4 py-4"
          >
            <p className="text-sm leading-5 text-error">
              {apiError}
            </p>
          </div>
        )}

        {/* Full name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className={labelClassName}
          >
            Full name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "name-error" : undefined
            }
            className={fieldClassName(Boolean(errors.name))}
            {...register("name", {
              required: "Full name is required",
              onChange: () => {
                if (apiError) {
                  setApiError("")
                }
              },
            })}
          />

          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-sm leading-5 text-error"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className={labelClassName}
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "email-error" : undefined
            }
            className={fieldClassName(Boolean(errors.email))}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
              onChange: () => {
                if (apiError) {
                  setApiError("")
                }
              },
            })}
          />

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-sm leading-5 text-error"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={labelClassName}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "password-error" : undefined
            }
            className={fieldClassName(Boolean(errors.password))}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password must be at least 6 characters",
              },
              onChange: () => {
                if (apiError) {
                  setApiError("")
                }
              },
            })}
          />

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm leading-5 text-error"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
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