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
          <header className="border-b border-divider bg-surface">
            <div className="mx-auto flex h-17 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <Link
                to="/login"
                className="flex items-center gap-3 text-[1.05rem] font-semibold tracking-tight text-text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                  RB
                </span>

                <span>Relocation Budget</span>
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