import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import { getQueries, deleteQuery } from "../services/authService";

interface Query {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  subject?: string;
}

const QueryDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const deleteMutation = useMutation({
    mutationFn: deleteQuery,
    onSuccess: () => {
      toast.success("Query deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      navigate("/admin/queries");
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to delete query."
      );
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="px-4 py-6 text-center text-muted-foreground sm:px-6">
          Loading...
        </p>
      </AdminLayout>
    );
  }

  if (!query || !id) {
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
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-md rounded-xl bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">
            Delete Query
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Are you sure you want to delete the query
          </p>

          <p className="mt-1 break-words font-semibold text-foreground">
            {query.subject || "No subject"}
            {" · "}
            {query.name || query.fullName || "Unknown"}?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/queries")}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
              className="rounded-lg bg-primary   px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QueryDelete;