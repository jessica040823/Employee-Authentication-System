import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaServicestack, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getServices } from "../services/authService";
import AdminLayout from "../components/layouts/AdminLayout";


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

const API_BASE_URL = "http://192.168.150.169:3000";
const DEFAULT_IMAGE = "/images/default-service.jpg";

const getImageUrl = (service: Service) =>
  service?.image ? `${API_BASE_URL}/public/${service.image}` : DEFAULT_IMAGE;

const getServiceId = (service: Service) => service?.id ?? service?._id;

const getServiceTitle = (service: Service) =>
  service?.title || service?.name || "Service";

const formatPrice = (service: Service) =>
  service?.price === undefined || service?.price === null || service?.price === ""
    ? "-"
    : `${service?.currency || "NPR"} ${Number(service.price).toLocaleString()}`;

const getMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : error instanceof Error
    ? error.message || fallback
    : fallback;

const AdminServices = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const services = useMemo<Service[]>(() => {
    if (Array.isArray(data)) return data;
    return data?.data || data?.services || [];
  }, [data]);

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-xl bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-primary" />
            <h2 className="font-semibold text-foreground">Loading Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while services are being loaded.
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-foreground">Services</h1>
            <span className="text-xs text-muted-foreground">
              {filteredServices.length} of {services.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
            />

            <Link
              to="/admin/services/new"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <FaPlus size={12} />
              Add Service
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[700px]">
            <thead className="bg-secondary">
              <tr>
                {["Service", "Price", "Tags", "Created At", "Actions"].map(
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
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => {
                  const id = getServiceId(service);

                  return (
                    <tr
                      key={id ?? index}
                      className="border-t border-border transition hover:bg-secondary/40"
                    >
                      <td className="px-4 py-3 text-left text-sm">
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

                      <td className="px-4 py-3 text-left text-sm font-medium text-foreground">
                        {formatPrice(service)}
                      </td>

                      <td className="px-4 py-3 text-left text-sm">
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

                      <td className="px-4 py-3 text-left text-sm text-muted-foreground">
                        {service?.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3 text-left text-sm">
                        <div className="flex items-center justify-start gap-2">
                          <Link
                            to={`/admin/services/${id}/edit`}
                            className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary"
                          >
                            Edit
                          </Link>

                          <Link
                            to={`/admin/services/${id}/delete`}
                            className="rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground transition hover:border-primary hover:text-primary"
                          >
                            Delete
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
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
      </div>
    </AdminLayout>
  );
};

export default AdminServices;