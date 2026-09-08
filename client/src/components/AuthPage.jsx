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
    <main className="min-h-[calc(100vh-4.25rem)] bg-canvas">
      <div className="mx-auto flex min-h-[calc(100vh-4.25rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-2xl border border-divider bg-surface shadow-sm lg:min-h-184 lg:grid-cols-[1fr_1fr]">
          {/* Brand panel */}
          <aside className="hidden border-r border-divider bg-surface-raised lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-14">
            <div className="max-w-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                RB
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Relocation planning
              </p>

              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-text-primary xl:text-[2.8rem]">
                Plan your move with financial clarity.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-text-muted">
                Track your savings, planned expenses, currencies, and
                financial runway in one place.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  "Track relocation expenses in multiple currencies",
                  "See your remaining budget at a glance",
                  "Estimate your monthly financial runway",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-text-primary">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="max-w-md text-xs leading-5 text-text-muted">
              A practical tool for planning the financial side of your
              international move.
            </p>
          </aside>

          {/* Form panel */}
          <section className="flex items-center">
            <div className="mx-auto w-full max-w-lg px-6 py-12 sm:px-10 sm:py-16 lg:px-12 xl:px-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary lg:hidden">
                  Relocation planning
                </p>

                <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-[2.5rem]">
                  {title}
                </h1>

                <p className="mt-4 max-w-md text-base leading-7 text-text-muted">
                  {description}
                </p>
              </div>

              <div className="mt-9">
                {children}
              </div>

              {footerText && footerLink && footerLabel && (
                <p className="mt-9 border-t border-divider pt-6 text-sm text-text-muted">
                  {footerText}{" "}
                  <Link
                    to={footerLink}
                    className="font-semibold text-text-primary underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {footerLabel}
                  </Link>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AuthPage