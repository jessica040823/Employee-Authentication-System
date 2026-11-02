import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEnvelope, FaTrash } from "react-icons/fa";
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

const isQueryRead = (query: Query) =>
  query?.isRead === true || query?.read === true || query?.status === "read";

const QueryDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["queries"],
    queryFn: getQueries,
  });

  const query = useMemo<Query | undefined>(() => {
    const list: Query[] = Array.isArray(data)
      ? data
      : data?.data || data?.contacts || data?.queries || [];
    return list.find((q) => (q._id || q.id) === id);
  }, [data, id]);

  const readMutation = useMutation({
    mutationFn: markQueryRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
  });

  const { mutate: markRead } = readMutation;

  // Page khulda read mark garne
  useEffect(() => {
    if (query && id && !isQueryRead(query)) {
      markRead(id);
    }
  }, [query, id, markRead]);

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="px-4 py-6 text-center text-muted-foreground sm:px-6">
          Loading...
        </p>
      </AdminLayout>
    );
  }

  if (!query) {
    return (
      <AdminLayout>
        <div className="px-4 py-6 text-center sm:px-6">
          <p className="text-muted-foreground">Query not found.</p>
          <Link
            to="/admin/queries"
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            ← Back to queries
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              Query Details
            </h1>

            <Link
              to="/admin/queries"
              className="text-sm text-primary hover:underline"
            >
              ← Back
            </Link>
          </div>

          <div className="space-y-4 rounded-xl bg-card p-5 shadow-sm sm:p-6">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="mt-1 font-semibold text-card-foreground">
                {query.name || query.fullName || "Not available"}
              </p>
            </div>

            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Email</p>
              <div className="mt-1 flex items-center gap-2">
                <FaEnvelope className="shrink-0 text-primary" />
                <p className="break-all font-semibold text-card-foreground">
                  {query.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Subject</p>
              <p className="mt-1 font-semibold text-card-foreground">
                {query.subject || "No subject"}
              </p>
            </div>

            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Message</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-card-foreground">
                {query.message || query.description || "No message available."}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/admin/queries"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Close
              </Link>

              <Link
                to={`/admin/queries/${id}/delete`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                <FaTrash size={12} />
                Delete
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QueryDetails;