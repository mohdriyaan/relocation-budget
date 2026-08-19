// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink,Navigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinkStyles = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 block ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 font-bold text-lg text-white tracking-wide">
            <NavLink to="/home">App</NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
            <NavLink to="/home" className={navLinkStyles}>
              Home
            </NavLink>
            <NavLink to="/calculator" className={navLinkStyles}>
              Calculator
            </NavLink>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              className="text-slate-300 hover:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  /* Close (X) Icon */
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  /* Hamburger Icon */
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <NavLink to="/home" className={navLinkStyles} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink
            to="/calculator"
            className={navLinkStyles}
            onClick={closeMenu}
          >
            Calculator
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;