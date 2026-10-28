import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/authService";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


const API_BASE_URL = "http://192.168.150.169:3000";
const DEFAULT_IMAGE = "/images/default-service.jpg";

// Image API ko public folder ma chha: 3000/public/<service.image>
const getImageUrl = (service : any) =>
  service?.image ? `${API_BASE_URL}/public/${service.image}` : DEFAULT_IMAGE;

const Services = () => {
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
      <section className="min-h-screen bg-background px-4 sm:px-6 py-12 sm:py-16">

        <div className="text-center">

          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Our Services
          </h1>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base text-muted-foreground">
            Loading services...
          </p>

        </div>

      </section>
    );
  }


  // Error
  if (isError) {
    return (
      <section className="min-h-screen bg-background px-4 sm:px-6 py-12 sm:py-16">

        <div className="text-center">

          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Our Services
          </h1>

          <p className="mt-5 sm:mt-6 text-destructive">
            Failed to load services.
          </p>

          <p className="mt-2 text-sm text-muted-foreground break-words">
            {error?.message}
          </p>

        </div>

      </section>
    );
  }


   return (
    <>
      <section className="min-h-screen bg-background px-4 sm:px-6 py-12 sm:py-16">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Our Services
          </h1>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Explore the services we provide.
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {services?.map((service: any) => (
            <div
              key={service.id}
              className="bg-card rounded-xl shadow-md p-4 sm:p-6 text-center hover:bg-secondary transition"
            >
              <img
 src={getImageUrl(service)}
 alt={service?.title || "Service"}
 className="w-full h-40 sm:h-44 object-cover rounded-xl"
 onError={(e) => {
 e.currentTarget.onerror = null;
 e.currentTarget.src = DEFAULT_IMAGE;
 }}
 />

              <h2 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold">
                {service.title}
              </h2>

              <p className="mt-2 sm:mt-3 text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              <Link
                to={`/services/${service.id}`}
                className="inline-block mt-4 sm:mt-5 text-sm font-semibold text-primary hover:underline"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Services;