import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import { getServices, deleteService } from "../services/authService";

interface Service {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
}

const AdminServiceDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const service = useMemo<Service | undefined>(() => {
    const list: Service[] = Array.isArray(data)
      ? data
      : data?.data || data?.services || [];
    return list.find((s) => (s.id ?? s._id) === id);
  }, [data, id]);

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      navigate("/admin/services");
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to delete service."
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

  if (!service || !id) {
    return (
      <AdminLayout>
        <div className="px-4 py-6 text-center sm:px-6">
          <p className="text-muted-foreground">Service not found.</p>
          <Link
            to="/admin/services"
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            ← Back to services
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
            Delete Service
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Are you sure you want to delete
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {service.title || service.name || "this service"}?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
              className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServiceDelete;