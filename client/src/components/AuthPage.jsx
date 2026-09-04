import { Link } from "react-router-dom"

const AuthPage = ({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLabel,
}) => {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-14 sm:px-6 sm:py-20">
      <section className="w-full max-w-lg">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-medium text-text-muted">
            Welcome back
          </p>

          <h1 className="text-3xl font-semibold leading-tighter tracking-tightest text-text-primary sm:text-4xl">
            {title}
          </h1>

          <p className="max-w-sm text-sm leading-6 text-text-muted">
            {description}
          </p>
        </div>

        <div className="mt-10">
          {children}
        </div>

        {footerText && footerLink && footerLabel && (
          <p className="mt-8 border-t border-white/5 pt-6 text-sm text-text-muted">
            {footerText}{" "}
            <Link
              to={footerLink}
              className="text-sm text-text-muted underline-offset-4 transition-colors hover:text-text-primary hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {footerLabel}
            </Link>
          </p>
        )}
      </section>
    </main>
  )
}

export default AuthPage