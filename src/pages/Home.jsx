import SliderImport from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/Footer";

const Slider = SliderImport.default ?? SliderImport;

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-center">

      {/* IMAGE SLIDER */}
      <div className="mx-auto w-full">
        <Slider {...settings}>
          <div>
            <img
              src="/image1.png"
              alt="Employee Portal"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>

          <div>
            <img
              src="/image2.png"
              alt="Employee Portal"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>

          <div>
            <img
              src="/image3.png"
              alt="Employee Portal"
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-[30rem]"
            />
          </div>
        </Slider>
      </div>

      {/* ABOUT SECTION */}
      <section className="mx-auto mt-12 max-w-6xl px-4 pb-12 sm:mt-16 sm:px-6">
        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">

          <div className="flex flex-col justify-center text-left">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              About Employee Portal
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              Welcome to Employee Portal. Our platform makes employee
              registration and information management simple and convenient.
              We help organizations manage employee details efficiently
              in one place.
            </p>

            <Link
              to="/about"
              className="mt-5 w-fit font-semibold text-primary hover:opacity-80 sm:mt-6"
            >
              View More →
            </Link>
          </div>

          <div className="w-full overflow-hidden rounded-2xl">
            <img
              src="/image4.png"
              alt="Employee Portal"
              className="h-64 w-full object-cover sm:h-80 md:h-full md:min-h-64"
            />
          </div>

        </div>
      </section>

      {/* WHY CHOOSE OUR PORTAL */}
      <section className="flex flex-col justify-center py-12">
        <div className="justify-center">
          <h2 className="text-4xl font-bold text-foreground">
            Why Choose Our Portal?
          </h2>

          <p className="mt-3 text-muted-foreground">
            A simple way to manage employee information.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-secondary p-6 text-center">
            <h3 className="text-xl font-bold text-foreground">
              Easy to Use
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Simple and user-friendly platform for everyone.
            </p>
          </div>

          <div className="rounded-xl bg-secondary p-6 text-center">
            <h3 className="text-xl font-bold text-foreground">
              Organized
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Keep employee information organized in one place.
            </p>
          </div>

          <div className="rounded-xl bg-secondary p-6 text-center">
            <h3 className="text-xl font-bold text-foreground">
              Convenient
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage employee information quickly and conveniently.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Home;