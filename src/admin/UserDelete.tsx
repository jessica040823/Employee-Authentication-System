import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import { getUsers, deleteUser } from "../services/authService";

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
}

const UserDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const user = useMemo<User | undefined>(() => {
    const list: User[] = Array.isArray(data)
      ? data
      : data?.data || data?.users || [];
    return list.find((u) => (u.id ?? u._id) === id);
  }, [data, id]);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/users");
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to delete user."
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

  if (!user || !id) {
    return (
      <AdminLayout>
        <div className="px-4 py-6 text-center sm:px-6">
          <p className="text-muted-foreground">User not found.</p>
          <Link
            to="/admin/users"
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            ← Back to users
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
            Delete User
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Are you sure you want to delete
          </p>

          <p className="mt-1 break-words font-semibold text-foreground">
            {user.fullName || user.email || "this user"}?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDelete;