
import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCode,
  FaPalette,
  FaLightbulb,
} from "react-icons/fa6";

import SliderImport from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";

const Slider = (SliderImport as any).default ?? SliderImport;

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  const services = [
    {
      icon: <FaCode />,
      title: "Web Development",
      description:
        "Modern and responsive websites built according to your needs.",
    },
    {
      icon: <FaPalette />,
      title: "UI/UX Design",
      description:
        "Simple and user-friendly designs for a better experience.",
    },
    {
      icon: <FaLightbulb />,
      title: "Creative Solutions",
      description:
        "Useful digital solutions that help turn ideas into reality.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-center">

      {/* ================= IMAGE SLIDER ================= */}
      <section className="w-full">
        <Slider {...settings}>
          <div>
            <img
              src="/image1.png"
              alt="Digital Services"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>

          <div>
            <img
              src="/image2.jpg"
              alt="Creative Solutions"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>

          <div>
            <img
              src="/image3.jpg"
              alt="Our Services"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>
        </Slider>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="mx-auto mt-14 max-w-6xl px-5 pb-12 sm:mt-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

          <div className="text-left">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              About Us
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              Welcome to our platform. We provide digital services and
              solutions that are simple, useful, and easy to access.
              Our goal is to help users find the right services and
              information in one place.
            </p>

            <Link
              to="/about"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              Learn More
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl">
            <img
              src="/image4.jpg"
              alt="About Us"
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">

          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Our Services
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We provide simple and useful digital services for different needs.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border bg-card p-6 text-left shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-lg text-primary">
                  {service.icon}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>

                <Link
                  to="/services"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View Services
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              View All Services
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-secondary px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">

          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Why Choose Us?
          </h2>

          <p className="mt-3 text-muted-foreground">
            We focus on making our platform simple and convenient.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-card p-6">
              <h3 className="text-lg font-bold text-foreground">
                Easy to Use
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Simple and user-friendly platform that is easy to understand.
              </p>
            </div>

            <div className="rounded-xl bg-card p-6">
              <h3 className="text-lg font-bold text-foreground">
                Reliable
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We aim to provide useful and reliable services to our users.
              </p>
            </div>

            <div className="rounded-xl bg-card p-6">
              <h3 className="text-lg font-bold text-foreground">
                Convenient
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Find services and information easily from one platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">

          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Need Our Services?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Have any questions or want to know more about our services?
            Feel free to contact us.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Contact Us
            <FaArrowRight className="text-sm" />
          </Link>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Home;
