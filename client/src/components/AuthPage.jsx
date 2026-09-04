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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-divider bg-surface p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {title}
          </h1>

          <p className="text-sm leading-6 text-text-muted">
            {description}
          </p>
        </div>

        <div className="mt-6">
          {children}
        </div>

        {footerText && footerLink && footerLabel && (
          <p className="mt-6 text-center text-sm text-text-muted">
            {footerText}{" "}
            <Link
              to={footerLink}
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
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