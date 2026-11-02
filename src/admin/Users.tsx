import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTable, tableFeatures } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrash, FaUserShield, FaUserMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { getUsers, makeAdmin, removeAdmin } from "../services/authService";
import AdminLayout from "../components/layouts/AdminLayout";

interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

const features = tableFeatures({});

const iconBtn =
  "inline-flex items-center justify-center rounded-lg border border-border bg-secondary p-2 transition hover:border-primary disabled:opacity-50";

const Users = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleTarget, setRoleTarget] = useState<User | null>(null);

  // GET USERS
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

  // SEARCH USERS
  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return userList;

    return userList.filter((user) => {
      const name = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";

      return name.includes(searchText) || email.includes(searchText);
    });
  }, [userList, search]);

  // PROMOTE / DEMOTE
  const roleMutation = useMutation({
    mutationFn: ({ id, promote }: { id: string; promote: boolean }) =>
      promote ? makeAdmin(id) : removeAdmin(id),

    onSuccess: (_data, variables) => {
      toast.success(
        variables.promote
          ? "User promoted to admin!"
          : "Admin demoted to user!"
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : error.message || "Failed to change role."
      );
    },
  });

  const { mutate: changeRole, isPending: isChangingRole } = roleMutation;

  // Icon thichda modal kholne
  const handleRoleChange = useCallback((user: User) => {
    setRoleTarget(user);
  }, []);

  // Modal ma Confirm thichda API call
  const confirmRoleChange = () => {
    if (!roleTarget) return;

    const id = roleTarget.id ?? roleTarget._id;
    if (!id) return;

    changeRole(
      { id, promote: roleTarget.role !== "admin" },
      { onSettled: () => setRoleTarget(null) }
    );
  };

  // TABLE COLUMNS
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
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.fullName || "User"}
          </span>
        ),
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

      // ACTIONS (icons)
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          const id = user.id ?? user._id;
          const isAdmin = user.role === "admin";

          return (
            <div className="flex items-center justify-center gap-2">
              {/* EDIT */}
              <Link
                to={`/admin/users/${id}/edit`}
                className={`${iconBtn} text-primary`}
                title="Edit user"
                aria-label="Edit user"
              >
                <FaEdit size={14} />
              </Link>

              {/* PROMOTE / DEMOTE */}
              <button
                type="button"
                onClick={() => handleRoleChange(user)}
                disabled={isChangingRole}
                className={`${iconBtn} ${
                  isAdmin ? "text-amber-500" : "text-green-600"
                }`}
                title={isAdmin ? "Demote to user" : "Promote to admin"}
                aria-label={isAdmin ? "Demote to user" : "Promote to admin"}
              >
                {isAdmin ? <FaUserMinus size={14} /> : <FaUserShield size={14} />}
              </button>

              {/* DELETE */}
              <Link
                to={`/admin/users/${id}/delete`}
                className={`${iconBtn} text-red-500 hover:border-red-500`}
                title="Delete user"
                aria-label="Delete user"
              >
                <FaTrash size={14} />
              </Link>
            </div>
          );
        },
      },
    ],
    [handleRoleChange, isChangingRole]
  );

  // TANSTACK TABLE
  const table = useTable({
    key: "users-table",
    data: filteredUsers,
    columns,
    features,
  });

  // LOADING
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-xl bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-primary" />
            <h2 className="font-semibold text-foreground">Loading Users</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while users are being loaded.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ERROR
  if (isError) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center px-4">
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
      </AdminLayout>
    );
  }

  // MAIN PAGE
  return (
    <AdminLayout>
      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-foreground">Users</h1>
            <span className="text-xs text-muted-foreground">
              {filteredUsers.length} of {userList.length}
            </span>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[600px]">
            <thead className="bg-secondary">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-secondary-foreground"
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
                      <td key={cell.id} className="px-4 py-3 text-center text-sm">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
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
      </div>

      {/* PROMOTE / DEMOTE CONFIRM MODAL */}
      {roleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isChangingRole && setRoleTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-xl bg-card p-6 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                roleTarget.role === "admin"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {roleTarget.role === "admin" ? (
                <FaUserMinus size={20} />
              ) : (
                <FaUserShield size={20} />
              )}
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              {roleTarget.role === "admin"
                ? "Demote to User"
                : "Promote to Admin"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {roleTarget.role === "admin"
                ? "Remove admin access from"
                : "Give admin access to"}{" "}
              <span className="font-semibold text-foreground">
                {roleTarget.fullName || roleTarget.email || "this user"}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setRoleTarget(null)}
                disabled={isChangingRole}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmRoleChange}
                disabled={isChangingRole}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {isChangingRole ? "Please wait..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;