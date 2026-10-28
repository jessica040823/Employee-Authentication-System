import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("authToken")
  );

  const [role, setRole] = useState(localStorage.getItem("userRole"));

  const isAdmin = isAuth && role === "admin";

  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Check authentication and role whenever auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(!!localStorage.getItem("authToken"));
      setRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("authChanged"));

    closeMenu();

    toast.success("Logged out successfully");

    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 left-0 z-50 w-full border-b border-border bg-secondary shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img
            src="/logo1.jpg"
            alt="ServiceSphere Logo"
            className="size-10 rounded-full object-cover sm:size-12"
          />

          <div className="text-base font-bold sm:text-xl">
            ServiceSphere
          </div>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden items-center gap-5 text-sm font-medium md:flex lg:gap-6">

          {/* Home */}
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>

          {/* About */}
          <Link
            to="/about"
            className="text-foreground transition-colors hover:text-primary"
          >
            About
          </Link>

          {/* Services */}
          <Link
            to="/services"
            className="text-foreground transition-colors hover:text-primary"
          >
            Services
          </Link>

          {/* Contact Us */}
          <Link
            to="/contact"
            className="text-foreground transition-colors hover:text-primary"
          >
            Contact Us
          </Link>

          {/* ================= PROFILE ================= */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex size-9 items-center justify-center rounded-full border-2 border-foreground text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Open account menu"
            >
              <FiUser className="text-lg" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">

                {/* Guest */}
                {!isAuth && (
                  <>
                    <Link
                      to="/auth/register"
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      Register
                    </Link>

                    <Link
                      to="/auth/login"
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      Login
                    </Link>
                  </>
                )}

                {/* Logged-in User */}
                {isAuth && (
                  <>
                    {/* Admin only */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMenu}
                        className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/change-password"
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      Change Password
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      Logout
                    </button>
                  </>
                )}

              </div>
            )}

          </div>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsProfileOpen(false);
          }}
          className="rounded-sm p-2 text-foreground transition-colors hover:text-primary md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* ================= MOBILE NAVIGATION ================= */}
      {isMenuOpen && (
        <div className="border-t border-border bg-secondary px-4 pb-4 pt-3 md:hidden">

          <div className="flex flex-col gap-3 text-sm font-medium">

            {/* Home */}
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              Home
            </Link>

            {/* About */}
            <Link
              to="/about"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              About
            </Link>

            {/* Services */}
            <Link
              to="/services"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              Services
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
            >
              Contact Us
            </Link>

            {/* ================= MOBILE ACCOUNT ================= */}
            <div className="border-t border-border pt-3">

              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-foreground transition-colors hover:bg-background hover:text-primary"
              >
                <span className="flex size-2 items-center justify-center rounded-full border-2 border-current">
                  <FiUser className="text-base" />
                </span>

                <span>Account</span>
              </button>

              {isProfileOpen && (
                <div className="mt-2 flex flex-col gap-1 pl-3">

                  {/* Guest */}
                  {!isAuth && (
                    <>
                      <Link
                        to="/auth/register"
                        onClick={closeMenu}
                        className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                      >
                        Register
                      </Link>

                      <Link
                        to="/auth/login"
                        onClick={closeMenu}
                        className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                      >
                        Login
                      </Link>
                    </>
                  )}
                  
                  {/* Logged-in User */}
                  {isAuth && (
                    <>
                      {/* Admin only */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                        >
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/change-password"
                        onClick={closeMenu}
                        className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-background hover:text-primary"
                      >
                        Change Password
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md px-3 py-2 text-left text-foreground transition-colors hover:bg-background hover:text-primary"
                      >
                        Logout
                      </button>
                    </>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;