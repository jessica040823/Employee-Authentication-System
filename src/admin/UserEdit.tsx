import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import { getUsers, updateUser } from "../services/authService";

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface UserForm {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const emptyForm: UserForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "user",
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UserForm>(emptyForm);

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

  // User ko data le form bharne
  useEffect(() => {
    if (!user) return;

    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
    });
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/users");
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to update user."
      );
    },
  });

  const handleSave = () => {
    if (!id) return;

    if (!form.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone is required.");
      return;
    }

    updateMutation.mutate({
      id,
      data: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="px-4 py-6 text-center text-muted-foreground sm:px-6">
          Loading user...
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
      <div className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Edit User</h1>

            <Link
              to="/admin/users"
              className="text-sm text-primary hover:underline"
            >
              ← Back
            </Link>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                disabled={updateMutation.isPending}
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserEdit;