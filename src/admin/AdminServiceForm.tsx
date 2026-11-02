import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AdminLayout from "../components/layouts/AdminLayout";
import {
  getServices,
  createService,
  updateService,
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
}

interface ServiceForm {
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

const emptyForm: ServiceForm = {
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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const getMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : error instanceof Error
    ? error.message || fallback
    : fallback;

const AdminServiceForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ServiceForm>(emptyForm);

  // Edit mode: list bata service tanne
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    enabled: isEditMode,
  });

  const service = useMemo<Service | undefined>(() => {
    if (!isEditMode) return undefined;
    const list: Service[] = Array.isArray(data)
      ? data
      : data?.data || data?.services || [];
    return list.find((s) => (s.id ?? s._id) === id);
  }, [data, id, isEditMode]);

  // Edit mode ma form bharne
  useEffect(() => {
    if (!service) return;

    setForm({
      title: service.title || service.name || "",
      slug: service.slug || "",
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      price: service.price ?? "",
      currency: service.currency || "NPR",
      tags: Array.isArray(service.tags) ? service.tags.join(", ") : "",
      isActive: service.isActive !== false,
      image: service.image || "",
      imageFile: null,
    });
  }, [service]);

  // Naya image ko preview
  const previewUrl = useMemo(
    () => (form.imageFile ? URL.createObjectURL(form.imageFile) : null),
    [form.imageFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onDone = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["services"] });
    navigate("/admin/services");
  };

  const onFail = (fallback: string) => (error: unknown) => {
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

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (form.price !== "" && Number(form.price) < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

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

    if (form.imageFile) formData.append("image", form.imageFile);

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const imageSrc =
    previewUrl ||
    (form.image ? `${API_BASE_URL}/public/${form.image}` : DEFAULT_IMAGE);

  if (isEditMode && isLoading) {
    return (
      <AdminLayout>
        <p className="px-4 py-6 text-center text-muted-foreground sm:px-6">
          Loading service...
        </p>
      </AdminLayout>
    );
  }

  if (isEditMode && !service) {
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
      <div className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              {isEditMode ? "Edit Service" : "Add Service"}
            </h1>

            <Link
              to="/admin/services"
              className="text-sm text-primary hover:underline"
            >
              ← Back
            </Link>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  src={imageSrc}
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

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/services")}
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
      </div>
    </AdminLayout>
  );
};

export default AdminServiceForm;