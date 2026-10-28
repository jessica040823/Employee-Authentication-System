import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getServices } from "../services/authService";


const API_BASE_URL = "http://192.168.150.169:3000";
const DEFAULT_IMAGE = "/images/default-service.jpg";

// Image API ko public folder ma chha: 3000/public/<service.image>
const getImageUrl = (service : any ) =>
  service?.image ? `${API_BASE_URL}/public/${service.image}` : DEFAULT_IMAGE;

const ServiceDetails = () => {
  const { serviceId } = useParams();

  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });


  // Loading
  if (isLoading) {
    return (
      <section className="min-h-screen bg-background flex items-center justify-center px-4">

        <p className="text-sm sm:text-base text-muted-foreground">
          Loading service...
        </p>

      </section>
    );
  }


  // Error
  if (isError) {
    return (
      <section className="min-h-screen bg-background flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Failed to load service
          </h1>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground break-words">
            {error?.message}
          </p>

        </div>

      </section>
    );
  }


  // Find selected service
  const service = services?.find(
    (item : any) => String(item.id) === String(serviceId)
  );


  // Service not found
  if (!service) {
    return (
      <section className="min-h-screen bg-background flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Service Not Found
          </h1>

          <Link
            to="/services"
            className="inline-block mt-4 text-sm sm:text-base text-primary hover:underline"
          >
            Back to Services
          </Link>

        </div>

      </section>
    );
  }


  return (
    <section className="min-h-screen bg-background px-4 sm:px-6 py-10 sm:py-16">

      <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-md p-5 sm:p-8">

        {/* Service Image */}
        <img
 src={getImageUrl(service)}
 alt={service?.title || "Service"}
 className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl"
 onError={(e) => {
 e.currentTarget.onerror = null;
 e.currentTarget.src = DEFAULT_IMAGE;
 }}
 />


        {/* Title */}
        <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-bold text-primary">
          {service.title}
        </h1>


        {/* Short Description */}
        <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-7">
          {service.shortDescription}
        </p>


        {/* Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-7">
          {service.description}
        </p>


        {/* Price */}
        <div className="mt-5 sm:mt-6">

          <span className="text-sm text-muted-foreground">
            Starting Price
          </span>

          <p className="text-xl sm:text-2xl font-bold text-primary">
            {service.currency} {service.price}
          </p>

        </div>


        {/* Tags */}
        {service.tags?.length > 0 && (

          <div className="mt-5 sm:mt-6">

            <h2 className="font-semibold">
              Technologies
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">

              {service.tags.map((tag : any) => (

                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-secondary text-foreground text-xs sm:text-sm"
                >
                  {tag}
                </span>

              ))}

            </div>

          </div>

        )}


        {/* Back */}
        <Link
          to="/services"
          className="inline-block mt-6 sm:mt-8 text-sm font-semibold text-primary hover:underline"
        >
          ← Back to Services
        </Link>

      </div>

    </section>
  );
};

export default ServiceDetails;