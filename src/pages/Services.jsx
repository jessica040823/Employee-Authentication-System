import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/authService";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const serviceImages = {
  "web-developmentt": "/serviceImages/web1.jpg",
  "web-development": "/serviceImages/web2.png",
  "uiux": "/serviceImages/uiux.jpg",
  "mobile-app-development": "/serviceImages/mobile.jpg",
  "seo-digital-marketing": "/serviceImages/seo.jpg",
  "java-developers": "/serviceImages/java.jpg",
  "data-analyst": "/serviceImages/data.jpg",
  "qa": "/serviceImages/qa.jpg",
  "gardening": "/serviceImages/garden.jpg",
  "non-illum-qui-dolor": "/serviceImages/lorem1",
  "sit-ipsa-reprehend": "/serviceImages/lorem2.png",
  "ipsam-temporibus-iur": "/serviceImages/lorem3.jpg",
  "greek": "/serviceImages/greek.jpg"
};

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
          {services?.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-xl shadow-md p-4 sm:p-6 text-center hover:bg-secondary transition"
            >
              <img
                src={
                  serviceImages[service.slug] ||
                  "/images/default-service.jpg"
                }
                alt={service.title}
                className="w-full h-40 sm:h-44 object-cover rounded-xl"
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