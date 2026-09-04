import { Link, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"

const AppLayout = ({ children }) => {
  const location = useLocation()

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register"
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-text-primary">
      <div className="relative z-0">
        {isAuthRoute ? (
          <header className="border-b border-border-subtle">
            <div className="mx-auto flex h-14 max-w-lg items-center px-4 sm:px-6">
              <Link
                to="/login"
                className="text-sm font-semibold tracking-tight"
              >
                Relocation Budget
              </Link>
            </div>
          </header>
        ) : (
          <Navbar />
        )}

        {children}
      </div>
    </div>
  )
}

export default AppLayout