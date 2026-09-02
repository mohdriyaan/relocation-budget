// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkStyles = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 block ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
    }`;

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              onClick={closeMenu}
              className="shrink-0 font-bold text-lg text-white tracking-tight flex items-center gap-2.5"
            >
              <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-indigo-500/30">
                ⚡
              </span>
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Relocation OS
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1.5">
              <NavLink to="/" className={navLinkStyles}>
                Home
              </NavLink>
              <NavLink to="/calculator" className={navLinkStyles}>
                Calculator
              </NavLink>
            </div>
          </div>

          {/* Desktop Authentication Controls */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-400 text-xs font-mono">
                <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Checking session...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Hello, <strong className="text-white font-semibold">{user.name || "User"}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="text-xs sm:text-sm text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/25"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-2 backdrop-blur-xl">
          <NavLink to="/" className={navLinkStyles} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/calculator" className={navLinkStyles} onClick={closeMenu}>
            Calculator
          </NavLink>

          <div className="pt-2 border-t border-slate-800/80">
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-xs font-mono">
                <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Checking session...</span>
              </div>
            ) : user ? (
              <div className="space-y-2 pt-1">
                <div className="px-3 py-1.5 text-xs text-slate-400 font-medium">
                  Logged in as <strong className="text-white">{user.name || "User"}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/10 text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <NavLink
                  to="/login"
                  className="text-center py-2.5 rounded-xl text-slate-300 bg-slate-800/80 hover:bg-slate-800 text-sm font-semibold transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-center py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;