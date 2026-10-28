import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { useTable, tableFeatures } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import axios from "axios";
import { getUsers, updateUser, deleteUser } from "../services/authService";

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
}

interface EditingUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const features = tableFeatures({});

const Users = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);

  // =========================
  // GET USERS
  // =========================
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const userList = useMemo(() => (Array.isArray(users) ? users : []), [users]);

  // =========================
  // SEARCH USERS
  // =========================
  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return userList;

    return userList.filter((user) => {
      const name = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";

      return name.includes(searchText) || email.includes(searchText);
    });
  }, [userList, search]);

  // =========================
  // UPDATE USER
  // =========================
  const updateMutation = useMutation({
    mutationFn: updateUser,

    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },

    onError: (error) => {
      console.log("Update User Error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to update user."
      );
    },
  });

  // =========================
  // DELETE USER
  // =========================
  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.log("Delete User Error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to delete user."
      );
    },
  });

  const { mutate: deleteUserMutate, isPending: isDeleting } = deleteMutation;

  // =========================
  // EDIT USER
  // =========================
  const handleEdit = useCallback((user: User) => {
    setEditingUser({
      id: user.id ?? user._id ?? "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
    });
  }, []);

  // =========================
  // SAVE USER
  // =========================
  const handleSave = () => {
    if (!editingUser) return;

    if (!editingUser.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!editingUser.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!editingUser.phone.trim()) {
      toast.error("Phone is required.");
      return;
    }

    updateMutation.mutate({
      id: editingUser.id,
      data: {
        fullName: editingUser.fullName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
      },
    });
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = useCallback(
    (user: User) => {
      const id = user.id ?? user._id;
      if (!id) return;

      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${user.fullName || "this user"}?`
      );

      if (!confirmDelete) return;

      deleteUserMutate(id);
    },
    [deleteUserMutate]
  );

  // Close modal with Escape
  useEffect(() => {
    if (!editingUser) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingUser(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingUser]);

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = useMemo<ColumnDef<typeof features, User>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
          <span className="font-medium text-muted-foreground">
            #{row.original.id ?? row.original._id}
          </span>
        ),
      },

      {
        id: "fullName",
        header: "Full Name",
        accessorKey: "fullName",
        cell: ({ row }) => {
          const name = row.original.fullName || "User";

          return (
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                {name.charAt(0).toUpperCase()}
              </div>

              <span className="font-medium text-foreground">{name}</span>
            </div>
          );
        },
      },

      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.email || "-"}
          </span>
        ),
      },

      {
        id: "phone",
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.phone || "-"}
          </span>
        ),
      },

      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
          const role = row.original.role || "user";

          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                role === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-primary"
              }`}
            >
              {role}
            </span>
          );
        },
      },

      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original;

          const isActive =
            user.isActive !== undefined
              ? user.isActive
              : user.status === "active";

          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-accent text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },

      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => {
          const date = row.original.createdAt;

          if (!date) {
            return <span className="text-muted-foreground">-</span>;
          }

          return (
            <span className="text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </span>
          );
        },
      },

      // =========================
      // ACTIONS
      // =========================
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              {/* EDIT */}
              <button
                type="button"
                onClick={() => handleEdit(user)}
                className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                type="button"
                onClick={() => handleDelete(user)}
                disabled={isDeleting}
                className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [handleEdit, handleDelete, isDeleting]
  );

  // =========================
  // TANSTACK TABLE
  // =========================
  const table = useTable({
    key: "users-table",
    data: filteredUsers,
    columns,
    features,
  });

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

              <h2 className="font-semibold text-foreground">Loading Users</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while users are being loaded.
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
                Unable to Load Users
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {error?.message || "Something went wrong while loading users."}
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
          <h1 className="text-3xl font-bold text-foreground">Users</h1>

          <p className="mt-1 text-muted-foreground">
            View and manage registered users
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="mx-auto rounded-xl bg-card p-6 shadow-sm">
          {/* SEARCH */}
          <div className="mb-6 rounded-lg bg-secondary p-5">
            <div className="text-center">
              <h2 className="font-semibold text-card-foreground">Search Users</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Find a user by name or email
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* TABLE HEADER */}
          <div className="mb-5 border-b border-border pb-5 text-center">
            <h2 className="font-semibold text-card-foreground">All Users</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} displayed
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-secondary-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-border transition hover:bg-secondary/40"
                    >
                      {row.getAllCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-4 text-center text-sm"
                        >
                          <table.FlexRender cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-14 text-center">
                      <p className="font-medium text-foreground">No users found</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Try searching with another name or email.
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
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary">
                {userList.length}
              </span>{" "}
              users
            </p>
          </div>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingUser(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-foreground">Edit User</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update user information and role
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* FULL NAME */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Email
                </label>

                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Phone
                </label>

                <input
                  type="text"
                  maxLength={10}
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Role
                </label>

                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
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
      )}
    </div>
  );
};

export default Users;