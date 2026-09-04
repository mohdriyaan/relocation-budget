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
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <section className="w-full max-w-lg">
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-semibold leading-tighter tracking-tightest text-text-primary sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-sm text-base leading-7 text-text-muted">
            {description}
          </p>
        </div>

        <div className="mt-8">
          {children}
        </div>

        {footerText && footerLink && footerLabel && (
          <p className="mt-8 border-t border-border-subtle pt-6 text-sm text-text-muted">
            {footerText}{" "}
            <Link
              to={footerLink}
              className="font-medium text-text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
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