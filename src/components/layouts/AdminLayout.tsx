import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaArrowRight } from "react-icons/fa";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-accent"
  }`;

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/users", label: "Total Users" },
  { to: "/admin/services", label: "Total Services" },
  { to: "/admin/queries", label: "Queries" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  // mobile ma suru ma band; desktop ma CSS le sadhai dekhaucha
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-secondary p-5 transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/logo1.jpg"
            alt="ServiceSphere Logo"
            className="size-10 rounded-full object-cover"
          />
          <span className="text-xl font-bold text-foreground">ServiceSphere</span>
        </div>

        <nav className="space-y-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/admin/dashboard"}
              onClick={closeSidebar}
              className={linkClass}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-4 text-sm font-medium text-primary hover:underline"
          >
            View Website
            <FaArrowRight className="text-xs" />
          </NavLink>
        </div>
      </aside>

      {/* Content: desktop ma sidebar ko dahine */}
      <div className="min-w-0 md:ml-64">
        {/* Hamburger: mobile ma matra */}
        <div className="px-4 pt-4 sm:px-6 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg bg-primary p-3 text-primary-foreground hover:opacity-90"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 