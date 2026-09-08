import SliderImport from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  };

  return (
    <div className="min-h-screen bg-yellow-50 pt-24 text-center">

      {/* Heading */}
      <h1 className="text-4xl font-bold">
        Welcome to Employee Portal
      </h1>

      <p className="mt-4 text-gray-500">
        Register and manage employee information easily.
      </p>


      {/* Slider */}
      <div className="mx-auto mt-8 w-full">
        <Slider {...settings}>

          <div>
            <img
              src="/image1.jpg"
              alt="Employee Portal"
              className="h-120 w-full object-cover"
            />
          </div>

          <div>
            <img
              src="/image2.jpg"
              alt="Employee Portal"
              className="h-120 w-full object-cover"
            />
          </div>

          <div>
            <img
              src="/image3.jpg"
              alt="Employee Portal"
              className="h-120 w-full object-cover"
            />
          </div>

        </Slider>
      </div>


      {/* About Section */}
      <section className="mx-auto mt-16 max-w-6xl px-6 pb-12">

        <div className="grid items-stretch gap-10 md:grid-cols-2">

          {/* Left Side */}
          <div className="flex flex-col justify-center text-left">

            <h2 className="text-4xl font-bold">
              About Employee Portal
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Welcome to Employee Portal. Our platform makes employee
              registration and information management simple and convenient.
              We help organizations manage employee details efficiently
              in one place.
            </p>

            {/* View More Link */}
            <Link
              to="/about"
              className="mt-6 w-fit font-semibold text-purple-600 hover:text-purple-800"
            >
              View More →
            </Link>

          </div>


          {/* Right Side */}
          <div className="w-full overflow-hidden rounded-2xl">

            <img
              src="/image4.jpg"
              alt="Employee Portal"
              className="h-100 w-full object-cover"
            />

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="mt-8 w-full border-b border-purple-300 bg-purple-200 px-3 py-3 shadow-sm">

        <p className="mt-2 text-sm font-bold text-purple-900">
          © 2026 Employee Portal. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;