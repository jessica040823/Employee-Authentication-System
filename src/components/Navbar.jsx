import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const isAuth = false;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 z-50 w-full border-b border-border bg-secondary shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        
        {/* Logo + Employee Portal */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img
            src="/logo1.jpg"
            alt="Employee Portal Logo"
            className="size-10 rounded-full object-cover sm:size-12"
          />

          <div className="text-base font-bold sm:text-xl">
            Employee Portal
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 text-sm font-medium md:flex lg:gap-6">
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-foreground transition-colors hover:text-primary"
          >
            About
          </Link>

          <Link
            to="/services"
            className="text-foreground transition-colors hover:text-primary"
          >
            Services
          </Link>

          {!isAuth && (
            <>
              <Link
                to="/auth/login"
                className="text-foreground transition-colors hover:text-primary"
              >
                Login
              </Link>

              <Link
                to="/auth/register"
                className="text-foreground transition-colors hover:text-primary"
              >
                Register
              </Link>
            </>
          )}

          {isAuth && (
            <Link
              to="/admin/dashboard"
              className="text-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 text-foreground transition-colors hover:text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-secondary px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              About
            </Link>

            <Link
              to="/services"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              Services
            </Link>

            {!isAuth && (
              <>
                <Link
                  to="/auth/login"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                >
                  Login
                </Link>

                <Link
                  to="/auth/register"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                >
                  Register
                </Link>
              </>
            )}

            {isAuth && (
              <Link
                to="/admin/dashboard"
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;