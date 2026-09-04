import { useState } from "react"
import { NavLink, useNavigate, Link } from "react-router-dom"
import useAuth from "../hooks/useAuth.js"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      closeMenu()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navLinkStyles = ({ isActive }) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? "border-primary text-text-primary"
        : "border-transparent text-text-muted hover:border-divider hover:text-text-primary"
    }`

  const authLinkStyles = ({ isActive }) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "text-text-muted hover:bg-divider/40 hover:text-text-primary"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-divider bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
              RB
            </span>

            <span>Relocation Budget</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/"
              end
              className={navLinkStyles}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/calculator"
              end
              className={navLinkStyles}
            >
              Calculator
            </NavLink>
          </div>
        </div>

        <div className="hidden items-center md:flex">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-divider border-t-primary" />
              <span>Checking session...</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">
                Hello,{" "}
                <strong className="font-semibold text-text-primary">
                  {user.name || "User"}
                </strong>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-input-border px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-divider/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={authLinkStyles}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={authLinkStyles}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          className="rounded-md p-2 text-text-muted hover:bg-divider/40 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-divider bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navLinkStyles}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/calculator"
              onClick={closeMenu}
              end
              className={navLinkStyles}
            >
              Calculator
            </NavLink>
          </div>

          <div className="mt-4 border-t border-divider pt-4">
            {loading ? (
              <div className="flex items-center gap-2 px-2 py-2 text-sm text-text-muted">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-divider border-t-primary" />
                <span>Checking session...</span>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="px-2 py-1 text-sm text-text-muted">
                  Logged in as{" "}
                  <strong className="font-semibold text-text-primary">
                    {user.name || "User"}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md border border-input-border px-3 py-2 text-left text-sm font-medium text-text-primary transition-colors hover:bg-divider/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={authLinkStyles}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className={authLinkStyles}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar