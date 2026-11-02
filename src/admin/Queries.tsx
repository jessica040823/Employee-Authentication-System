import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaEye, FaTrash } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import { getQueries, markQueryRead } from "../services/authService";

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

const getQueryId = (query: Query) => query?._id || query?.id;

const isQueryRead = (query: Query) =>
  query?.isRead === true || query?.read === true || query?.status === "read";

const Queries = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

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

  const readMutation = useMutation({
    mutationFn: markQueryRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to update query status."
      );
    },
  });

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-xl bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-primary" />
            <h2 className="font-semibold text-foreground">Loading Queries</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while queries are being loaded.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center px-4">
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-foreground">Queries</h1>
            <span className="text-xs text-muted-foreground">
              {filteredQueries.length} of {queries.length} · {unreadCount} unread
            </span>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[800px]">
            <thead className="bg-secondary">
              <tr>
                {["User", "Email", "Subject", "Message", "Status", "Action"].map(
                  (title) => (
                    <th
                      key={title}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary-foreground"
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
                  const id = getQueryId(query);
                  const name = query?.name || query?.fullName || "Unknown";
                  const isRead = isQueryRead(query);

                  return (
                    <tr
                      key={id ?? index}
                      className="border-t border-border transition hover:bg-secondary/40"
                    >
                      <td className="px-4 py-3 text-left text-sm">
                        <div className="flex items-center justify-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-left text-sm text-muted-foreground">
                        {query?.email || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-left text-sm font-medium text-foreground">
                        {query?.subject || "No subject"}
                      </td>

                      <td className="max-w-[220px] px-4 py-3 text-left text-sm text-muted-foreground">
                        <p className="truncate">
                          {query?.message || query?.description || "No message"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-left text-sm">
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

                      <td className="px-4 py-3 text-left text-sm">
                        <div className="flex items-center justify-start gap-2">
                          <Link
                            to={`/admin/queries/${id}`}
                            className="rounded-lg border border-border bg-secondary p-2 text-primary transition hover:border-primary"
                            title="View Query"
                          >
                            <FaEye size={14} />
                          </Link>

                          <Link
                            to={`/admin/queries/${id}/delete`}
                            className="rounded-lg border border-border bg-secondary p-2 text-red-500 transition hover:border-red-500"
                            title="Delete Query"
                          >
                            <FaTrash size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
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
      </div>
    </AdminLayout>
  );
};

export default Queries;   