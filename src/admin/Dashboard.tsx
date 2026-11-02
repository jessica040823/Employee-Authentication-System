import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  FaBars,
  FaUsers,
  FaServicestack,
  FaEnvelope,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getUsers, getServices, getQueries } from "../services/authService";

interface Item {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  name?: string;
  title?: string;
  subject?: string;
  isActive?: boolean;
  isRead?: boolean;
  read?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Activity {
  key: string;
  icon: ReactNode;
  title: string;
  detail?: string;
  date?: string;
}

interface StatCardProps {
  to: string;
  label: string;
  value: string | number;
  note?: string;
  linkText: string;
  icon: ReactNode;
}

// =========================
// HELPERS
// =========================
// API le array ya { data / services / contacts / queries } dina sakchha
const toList = (data: any, keys: string[] = []): Item[] => {
  if (Array.isArray(data)) return data;

  for (const key of ["data", ...keys]) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const isQueryRead = (q: Item) =>
  q?.isRead === true || q?.read === true || q?.status === "read";

const timeAgo = (date?: string) => {
  if (!date) return "";

  const time = new Date(date).getTime();

  if (Number.isNaN(time)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const latest = (
  list: Item[],
  getDate: (item: Item) => string | undefined,
  count: number
) =>
  [...list]
    .filter((item) => getDate(item))
    .sort(
      (a, b) =>
        new Date(getDate(b)!).getTime() - new Date(getDate(a)!).getTime()
    )
    .slice(0, count);

// Refetch every 30 seconds so numbers stay fresh
const liveOptions = { refetchInterval: 30000 };

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-accent"
  }`;

// =========================
// STAT CARD (same look as the Home page service cards)
// =========================
const StatCard = ({ to, label, value, note, linkText, icon }: StatCardProps) => (
  <div className="rounded-xl border border-border bg-card p-6 text-left shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-lg text-primary">
      {icon}
    </div>

    <p className="mt-4 text-sm text-muted-foreground">{label}</p>

    <h3 className="mt-1 text-3xl font-bold text-foreground">{value}</h3>

    {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}

    <NavLink
      to={to}
      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      {linkText}
      <FaArrowRight className="text-xs" />
    </NavLink>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  // =========================
  // API DATA
  // =========================
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    ...liveOptions,
  });

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    ...liveOptions,
  });

  const queriesQuery = useQuery({
    queryKey: ["queries"],
    queryFn: getQueries,
    ...liveOptions,
  });

  const users = useMemo(() => toList(usersQuery.data, ["users"]), [usersQuery.data]);

  const services = useMemo(
    () => toList(servicesQuery.data, ["services"]),
    [servicesQuery.data]
  );

  const queries = useMemo(
    () => toList(queriesQuery.data, ["contacts", "queries"]),
    [queriesQuery.data]
  );

  // Loading -> "...", error -> "-", else the number
  const show = (query: UseQueryResult<any, Error>, value: string | number) => {
    if (query.isLoading) return "...";
    if (query.isError) return "-";
    return value;
  };

  // =========================
  // DERIVED NUMBERS
  // =========================
  const unreadQueries = queries.filter((q) => !isQueryRead(q)).length;

  const activeServices = services.filter(
    (s) => s?.isActive !== false && s?.status !== "inactive"
  ).length;

  const activePercent = services.length
    ? Math.round((activeServices / services.length) * 100)
    : 0;

  // =========================
  // RECENT ACTIVITY (from real data)
  // =========================
  const activities = useMemo(() => {
    const items: Activity[] = [
      ...latest(users, (u) => u?.createdAt, 2).map((u) => ({
        key: `user-${u.id ?? u._id}`,
        icon: <FaUsers />,
        title: "New user registered",
        detail: u.fullName || u.email,
        date: u.createdAt,
      })),

      ...latest(queries, (q) => q?.createdAt, 2).map((q) => ({
        key: `query-${q.id ?? q._id}`,
        icon: <FaEnvelope />,
        title: "New query received",
        detail: q.subject || q.name || q.fullName,
        date: q.createdAt,
      })),

      ...latest(services, (s) => s?.updatedAt || s?.createdAt, 1).map((s) => ({
        key: `service-${s.id ?? s._id}`,
        icon: <FaServicestack />,
        title: "Service updated",
        detail: s.title || s.name,
        date: s.updatedAt || s.createdAt,
      })),
    ];

    return items
      .sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      )
      .slice(0, 5);
  }, [users, queries, services]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-secondary p-5 transition-transform duration-300 md:sticky md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <NavLink
            to="/admin/dashboard"
            end
            onClick={closeSidebar}
            className={sidebarLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/profile"
            onClick={closeSidebar}
            className={sidebarLinkClass}
          >
            Profile
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={closeSidebar}
            className={sidebarLinkClass}
          >
            Total Users
          </NavLink>

          <NavLink
            to="/admin/services"
            onClick={closeSidebar}
            className={sidebarLinkClass}
          >
            Total Services
          </NavLink>

          <NavLink
            to="/admin/queries"
            onClick={closeSidebar}
            className={sidebarLinkClass}
          >
            Queries
          </NavLink>
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="min-h-screen min-w-0 flex-1 px-5 py-8 sm:px-8">
        <div className="mx-auto mt-8 max-w-6xl">
          {/* Header */}
          <div className="relative text-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute left-0 top-0 rounded-lg bg-primary p-3 text-primary-foreground hover:opacity-90 md:hidden"
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              to="/admin/users"
              label="Total Users"
              value={show(usersQuery, users.length)}
              linkText="View Users"
              icon={<FaUsers />}
            />

            <StatCard
              to="/admin/services"
              label="Total Services"
              value={show(servicesQuery, services.length)}
              note={
                servicesQuery.isSuccess ? `${activeServices} active` : undefined
              }
              linkText="View Services"
              icon={<FaServicestack />}
            />

            {/* Profile */}
            <div className="rounded-xl border border-border bg-card p-6 text-left shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-lg text-primary">
                <FaUser />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">Profile</p>

              <h3 className="mt-1 text-xl font-bold text-foreground">
                Admin Profile
              </h3>

              <NavLink
                to="/admin/profile"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View Profile
                <FaArrowRight className="text-xs" />
              </NavLink>
            </div>

            <StatCard
              to="/admin/queries"
              label="Queries"
              value={show(queriesQuery, queries.length)}
              note={
                queriesQuery.isSuccess ? `${unreadQueries} unread` : undefined
              }
              linkText="View Queries"
              icon={<FaEnvelope />}
            />
          </div>

          {/* Bottom Section (same band look as "Why Choose Us") */}
          <div className="mx-auto mt-8 max-w-6xl rounded-xl bg-secondary p-5 sm:p-6">
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 sm:gap-10">
              {/* Services Overview */}
              <div className="rounded-xl bg-card p-6 text-left">
                <h3 className="text-lg font-bold text-foreground">
                  Services Overview
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Overview of available services
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active services
                    </span>

                    <span className="font-semibold text-primary">
                      {show(servicesQuery, `${activeServices} / ${services.length}`)}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-secondary">
                    <div
                      className="h-3 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${activePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {show(servicesQuery, services.length)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Total Services
                    </p>
                  </div>

                  <div className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {show(queriesQuery, unreadQueries)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Unread Queries
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/admin/services"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Manage Services
                  <FaArrowRight className="text-sm" />
                </NavLink>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl bg-card p-6 text-left">
                <h3 className="text-lg font-bold text-foreground">
                  Recent Activity
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Latest activities on ServiceSphere
                </p>

                <div className="mt-5 space-y-5">
                  {activities.length > 0 ? (
                    activities.map((item) => (
                      <div key={item.key} className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg text-primary">
                          {item.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {item.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {item.detail ? `${item.detail} · ` : ""}
                            {timeAgo(item.date)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent activity yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;