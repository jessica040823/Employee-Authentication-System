import { useEffect, useMemo, useState } from "react";
import { FaQuestionCircle, FaEye, FaTrash, FaEnvelope, FaTimes } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { getQueries, deleteQuery, markQueryRead } from "../services/authService";

interface Query {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
  description?: string;
  isRead?: boolean;
  read?: boolean;
  status?: string;
}

// =========================
// HELPERS
// =========================
const getQueryId = (query: Query) => query?._id || query?.id;

const isQueryRead = (query: Query) =>
  query?.isRead === true || query?.read === true || query?.status === "read";

const Queries = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  // =========================
  // GET QUERIES
  // =========================
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["queries"],
    queryFn: getQueries,
  });

  const queries = useMemo<Query[]>(() => {
    if (Array.isArray(data)) return data;
    return data?.data || data?.contacts || data?.queries || [];
  }, [data]);

  const unreadCount = useMemo(
    () => queries.filter((q) => !isQueryRead(q)).length,
    [queries]
  );

  // =========================
  // SEARCH QUERIES
  // =========================
  const filteredQueries = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return queries;

    return queries.filter((query) => {
      const name = (query?.name || query?.fullName || "").toLowerCase();
      const email = (query?.email || "").toLowerCase();
      const subject = (query?.subject || "").toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        subject.includes(searchText)
      );
    });
  }, [queries, search]);

  // =========================
  // DELETE QUERY
  // =========================
  const deleteMutation = useMutation({
    mutationFn: deleteQuery,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      setSelectedQuery(null);
      toast.success("Query deleted successfully!");
    },

    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to delete query."
      );
    },
  });

  // =========================
  // MARK AS READ
  // =========================
  const readMutation = useMutation({
    mutationFn: markQueryRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },

    onError: (error) => {
      console.log("STATUS ERROR:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to update query status."
      );
    },
  });

  // Close modal with Escape
  useEffect(() => {
    if (!selectedQuery) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedQuery(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedQuery]);

  // =========================
  // HANDLERS
  // =========================
  // Viewing a query also marks it as read
  const handleView = (query: Query) => {
    setSelectedQuery(query);

    const id = getQueryId(query);

    if (id && !isQueryRead(query)) {
      readMutation.mutate(id);
    }
  };

  // Clicking the status badge marks it as read
  const handleStatusChange = (query: Query) => {
    const id = getQueryId(query);

    if (!id) {
      toast.error("Query ID not found.");
      return;
    }

    if (isQueryRead(query)) return;

    readMutation.mutate(id, {
      onSuccess: () => toast.success("Query marked as read!"),
    });
  };

  const handleDelete = (query: Query) => {
    const id = getQueryId(query);

    if (!id) {
      toast.error("Query ID not found.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this query?")) {
      deleteMutation.mutate(id);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="rounded-xl bg-card p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-primary" />

              <h2 className="font-semibold text-foreground">Loading Queries</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while queries are being loaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (isError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="w-full max-w-md rounded-xl bg-card p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <span className="text-xl font-bold text-primary">!</span>
              </div>

              <h2 className="text-lg font-semibold text-foreground">
                Unable to Load Queries
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {axios.isAxiosError(error)
                  ? error.response?.data?.message ?? error.message
                  : error?.message ||
                    "Something went wrong while loading queries."}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        {/* BACK */}
        <div className="mb-6">
          <NavLink
            to="/admin/dashboard"
            className="text-sm text-primary hover:underline"
          >
            ← Back
          </NavLink>
        </div>

        {/* HEADING */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Queries</h1>

          <p className="mt-1 text-muted-foreground">
            View and manage queries submitted by users
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="mx-auto rounded-xl bg-card p-6 shadow-sm">
          {/* SEARCH */}
          <div className="mb-6 rounded-lg bg-secondary p-5">
            <div className="text-center">
              <h2 className="font-semibold text-card-foreground">
                Search Queries
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Find a query by name, email or subject
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or subject..."
              className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* TABLE HEADER */}
          <div className="mb-5 border-b border-border pb-5 text-center">
            <h2 className="font-semibold text-card-foreground">All Queries</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {filteredQueries.length}{" "}
              {filteredQueries.length === 1 ? "query" : "queries"} displayed ·{" "}
              {unreadCount} unread
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary">
                <tr>
                  {["User", "Email", "Subject", "Message", "Status", "Action"].map(
                    (title) => (
                      <th
                        key={title}
                        className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-secondary-foreground"
                      >
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((query, index) => {
                    const id = getQueryId(query) || index;
                    const name = query?.name || query?.fullName || "Unknown";
                    const isRead = isQueryRead(query);

                    return (
                      <tr
                        key={id}
                        className="border-t border-border transition hover:bg-secondary/40"
                      >
                        {/* USER */}
                        <td className="px-4 py-4 text-left text-sm">
                          <div className="flex items-center justify-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                              {name.charAt(0).toUpperCase()}
                            </div>

                            <span className="font-medium text-foreground">
                              {name}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-4 text-left text-sm text-muted-foreground">
                          {query?.email || "N/A"}
                        </td>

                        {/* SUBJECT */}
                        <td className="px-4 py-4 text-left text-sm font-medium text-foreground">
                          {query?.subject || "No subject"}
                        </td>

                        {/* MESSAGE */}
                        <td className="max-w-[220px] px-4 py-4 text-left text-sm text-muted-foreground">
                          <p className="truncate">
                            {query?.message || query?.description || "No message"}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4 text-left text-sm">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(query)}
                            disabled={readMutation.isPending || isRead}
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition ${
                              isRead
                                ? "bg-secondary text-primary"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isRead ? "Read" : "Unread"}
                          </button>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4 text-left text-sm">
                          <div className="flex items-center justify-start gap-2">
                            <button
                              type="button"
                              onClick={() => handleView(query)}
                              className="rounded-lg border border-border bg-secondary p-2 text-primary transition hover:border-primary"
                              title="View Query"
                            >
                              <FaEye size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(query)}
                              disabled={deleteMutation.isPending}
                              className="rounded-lg border border-border bg-secondary p-2 text-red-500 transition hover:border-red-500 disabled:opacity-50"
                              title="Delete Query"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <FaQuestionCircle
                        className="mx-auto mb-3 text-muted-foreground"
                        size={26}
                      />

                      <p className="font-medium text-foreground">
                        No queries found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {search
                          ? "Try searching with another name, email or subject."
                          : "User queries will appear here."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="mt-5 text-center">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-primary">
                {filteredQueries.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary">
                {queries.length}
              </span>{" "}
              queries
            </p>
          </div>
        </div>
      </div>

      {/* QUERY DETAILS MODAL */}
      {selectedQuery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedQuery(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-card-foreground">
                  Query Details
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Full details of the submitted query
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Name</p>

                <p className="mt-1 font-semibold text-card-foreground">
                  {selectedQuery?.name || selectedQuery?.fullName || "Not available"}
                </p>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Email</p>

                <div className="mt-1 flex items-center gap-2">
                  <FaEnvelope className="text-primary" />

                  <p className="font-semibold text-card-foreground">
                    {selectedQuery?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Subject</p>

                <p className="mt-1 font-semibold text-card-foreground">
                  {selectedQuery?.subject || "No subject"}
                </p>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <p className="text-xs text-muted-foreground">Message</p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-card-foreground">
                  {selectedQuery?.message ||
                    selectedQuery?.description ||
                    "No message available."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;