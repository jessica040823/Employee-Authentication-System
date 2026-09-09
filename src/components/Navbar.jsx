import { Link } from "react-router-dom";

const isAuth = false;
function Navbar() {
  return (
    <nav className="sticky top-0 left-0 z-50 w-full border-b border-border bg-background shadow-sm rounded-2xl">
      <div className="mx-auto my-auto flex max-w-6xl items-center justify-between px-6 py-1">
        {/* Logo + Employee Portal */}
        <div className="flex items-center gap-3">
          <img
            src="/logo1.jpg"
            alt="Employee Portal Logo"
            className="size-12 rounded-full object-cover"
          />

          <div className="text-xl font-bold">
            Employee Portal
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
           <Link
            to="/services"
            className="text-foreground hover:text-primary transition-colors"
          >
            Services
          </Link>


          {!isAuth && (
            <>
              <Link
                to="/auth/login"
                className="text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>

              <Link
                to="/auth/register"
                className="text-foreground hover:text-primary transition-colors"
              >
                Register
              </Link>
            </>
          )}

          {isAuth && (
            <>
              <Link
                to="/admin/dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;