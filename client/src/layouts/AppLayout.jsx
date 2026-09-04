import { Link, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"

const AppLayout = ({ children }) => {
  const location = useLocation()

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register"
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-text-primary">
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.0125]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>

        <rect
          width="100%"
          height="100%"
          filter="url(#noise)"
          opacity="0.9"
        />
      </svg>

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