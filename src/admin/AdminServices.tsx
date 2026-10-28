import { useCallback, useEffect, useMemo, useState } from "react";
import { FaServicestack, FaPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/authService";

interface Service {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price?: string | number;
  currency?: string;
  tags?: string[];
  isActive?: boolean;
  image?: string;
  createdAt?: string;
}

interface ServiceForm {
  id: string | null;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string | number;
  currency: string;
  tags: string;
  isActive: boolean;
  image: string;
  imageFile: File | null;
}

const API_BASE_URL = "http://192.168.150.169:3000";
const DEFAULT_IMAGE = "/images/default-service.jpg";

// Image API ko public folder ma chha: 3000/public/<service.image>
const getImageUrl = (service: Service) =>
  service?.image ? `${API_BASE_URL}/public/${service.image}` : DEFAULT_IMAGE;

// =========================
// HELPERS
// =========================
const getServiceId = (service: Service) => service?.id ?? service?._id;

const getServiceTitle = (service: Service) =>
  service?.title || service?.name || "Service";

const formatPrice = (service: Service) =>
  service?.price === undefined || service?.price === null || service?.price === ""
    ? "-"
    : `${service?.currency || "NPR"} ${Number(service.price).toLocaleString()}`;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyForm: ServiceForm = {
  id: null,
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  currency: "NPR",
  tags: "",
  isActive: true,
  image: "",
  imageFile: null,
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const getMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : error instanceof Error
    ? error.message || fallback
    : fallback;

const AdminServices = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ServiceForm | null>(null); // null = modal closed
  const isEditMode = Boolean(form?.id);

  // Naya select gareko image ko preview
  const previewUrl = useMemo(
    () => (form?.imageFile ? URL.createObjectURL(form.imageFile) : null),
    [form?.imageFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // =========================
  // GET SERVICES
  // =========================
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const services = useMemo<Service[]>(() => {
    if (Array.isArray(data)) return data;
    return data?.data || data?.services || [];
  }, [data]);

  // =========================
  // SEARCH SERVICES
  // =========================
  const filteredServices = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return services;

    return services.filter((service) => {
      const title = getServiceTitle(service).toLowerCase();
      const slug = (service?.slug || "").toLowerCase();
      const tags = (service?.tags || []).join(" ").toLowerCase();

      return (
        title.includes(searchText) ||
        slug.includes(searchText) ||
        tags.includes(searchText)
      );
    });
  }, [services, search]);

  // =========================
  // MUTATIONS
  // =========================
  const onDone = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["services"] });
    setForm(null);
  };

  const onFail = (fallback: string) => (error: unknown) => {
    console.log(fallback, axios.isAxiosError(error) ? error.response?.data : error);
    toast.error(getMessage(error, fallback));
  };

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => onDone("Service added successfully!"),
    onError: onFail("Failed to add service."),
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => onDone("Service updated successfully!"),
    onError: onFail("Failed to update service."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: onFail("Failed to delete service."),
  });

  const { mutate: deleteServiceMutate, isPending: isDeleting } = deleteMutation;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // =========================
  // HANDLERS
  // =========================
  const handleAdd = () => setForm({ ...emptyForm });

  const handleEdit = useCallback((service: Service) => {
    setForm({
      id: getServiceId(service) ?? null,
      title: service?.title || service?.name || "",
      slug: service?.slug || "",
      shortDescription: service?.shortDescription || "",
      description: service?.description || "",
      price: service?.price ?? "",
      currency: service?.currency || "NPR",
      tags: Array.isArray(service?.tags) ? service.tags.join(", ") : "",
      isActive: service?.isActive !== false,
      image: service?.image || "",
      imageFile: null,
    });
  }, []);

  const handleDelete = useCallback(
    (service: Service) => {
      const id = getServiceId(service);
      if (!id) return;

      if (
        window.confirm(
          `Are you sure you want to delete ${getServiceTitle(service)}?`
        )
      ) {
        deleteServiceMutate(id);
      }
    },
    [deleteServiceMutate]
  );

  const handleSave = () => {
    if (!form) return;

    if (!form.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (form.price !== "" && Number(form.price) < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    // Image upload garna FormData (multipart) chahinchha
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("slug", form.slug.trim() || slugify(form.title));
    formData.append("shortDescription", form.shortDescription.trim());
    formData.append("description", form.description.trim());
    formData.append("currency", form.currency.trim() || "NPR");
    formData.append("isActive", String(form.isActive));

    if (form.price !== "") formData.append("price", String(form.price));

    form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => formData.append("tags", tag));

    // Naya image select gareko chha bhane matra pathaune
    if (form.imageFile) formData.append("image", form.imageFile);

    if (isEditMode && form.id) {
      updateMutation.mutate({ id: form.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Close modal with Escape
  useEffect(() => {
    if (!form) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setForm(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [form]);

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

              <h2 className="font-semibold text-foreground">Loading Services</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while services are being loaded.
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
                Unable to Load Services
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {getMessage(error, "Something went wrong while loading services.")}
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
          <h1 className="text-3xl font-bold text-foreground">Services</h1>

          <p className="mt-1 text-muted-foreground">
            Add and manage the services you offer
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="mx-auto rounded-xl bg-card p-6 shadow-sm">
          {/* SEARCH */}
          <div className="mb-6 rounded-lg bg-secondary p-5">
            <div className="text-center">
              <h2 className="font-semibold text-card-foreground">
                Search Services
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Find a service by title, slug or tag
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, slug or tag..."
              className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* TABLE HEADER */}
          <div className="mb-5 flex flex-col items-center justify-between gap-3 border-b border-border pb-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <h2 className="font-semibold text-card-foreground">All Services</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredServices.length}{" "}
                {filteredServices.length === 1 ? "service" : "services"} displayed
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <FaPlus size={12} />
              Add Service
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px]">
              <thead className="bg-secondary">
                <tr>
                  {["Service", "Price", "Tags", "Created At", "Actions"].map(
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
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => (
                    <tr
                      key={getServiceId(service) ?? index}
                      className="border-t border-border transition hover:bg-secondary/40"
                    >
                      {/* SERVICE */}
                      <td className="px-4 py-4 text-left text-sm">
                        <div className="flex items-center justify-start gap-3">
                          <img
                            src={getImageUrl(service)}
                            alt={service?.title || "Service"}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_IMAGE;
                            }}
                          />

                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {getServiceTitle(service)}
                            </p>

                            {(service?.shortDescription || service?.description) && (
                              <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                                {service.shortDescription || service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="px-4 py-4 text-left text-sm font-medium text-foreground">
                        {formatPrice(service)}
                      </td>

                      {/* TAGS */}
                      <td className="px-4 py-4 text-left text-sm">
                        <div className="flex max-w-[220px] flex-wrap gap-1">
                          {(service?.tags || []).slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                            >
                              {tag}
                            </span>
                          ))}

                          {!service?.tags?.length && (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </td>

                      {/* CREATED AT */}
                      <td className="px-4 py-4 text-left text-sm text-muted-foreground">
                        {service?.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-4 text-left text-sm">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(service)}
                            className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(service)}
                            disabled={isDeleting}
                            className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground transition hover:border-primary hover:text-primary disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <FaServicestack
                        className="mx-auto mb-3 text-muted-foreground"
                        size={26}
                      />

                      <p className="font-medium text-foreground">
                        No services found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {search
                          ? "Try searching with another title, slug or tag."
                          : "Click Add Service to create your first service."}
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
                {filteredServices.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary">
                {services.length}
              </span>{" "}
              services
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setForm(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-foreground">
                {isEditMode ? "Edit Service" : "Add Service"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {isEditMode
                  ? "Update service information"
                  : "Fill in the details of the new service"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* TITLE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Slug
                </label>

                <input
                  type="text"
                  value={form.slug}
                  placeholder={slugify(form.title) || "auto-generated"}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* CURRENCY */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Currency
                </label>

                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* STATUS */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Status
                </label>

                <select
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.value === "active" })
                  }
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Short Description
                </label>

                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {/* TAGS */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Tags (comma separated)
                </label>

                <input
                  type="text"
                  value={form.tags}
                  placeholder="React, Node, UI/UX"
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* IMAGE */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, imageFile: e.target.files?.[0] || null })
                  }
                  className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
                />

                <img
                  src={previewUrl || getImageUrl({ image: form.image })}
                  alt="Preview"
                  className="mt-3 h-32 w-full rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setForm(null)}
                disabled={isSaving}
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;