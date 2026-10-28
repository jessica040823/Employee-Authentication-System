import Footer from "@/components/Footer";
function About() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 text-center">

      {/* About Header */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          About Employee Portal
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-6 sm:leading-7">
          A simple and convenient platform for managing employee
          information and registration in one place.
        </p>

      </section>


      {/* About Main Section */}
      <section className="mx-auto mt-8 sm:mt-12 max-w-6xl px-4 sm:px-6 pb-10 sm:pb-16">

        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-6 sm:gap-10">

          {/* Left Side */}
          <div className="flex flex-col justify-center rounded-2xl bg-accent p-6 sm:p-8 text-left shadow-sm">

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              What is Employee Portal?
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-foreground/80">
              Employee Portal is a simple platform designed to make
              employee registration and information management easier.
              It allows organizations to keep employee information
              organized and accessible in one place.
            </p>

            <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-foreground/80">
              Our goal is to provide a simple and convenient system
              that helps manage employee details efficiently.
            </p>

          </div>


          {/* Right Side */}
          <div className="overflow-hidden rounded-2xl shadow-sm">

            <img
              src="/image4.png"
              alt="Employee Portal"
              className="h-64 sm:h-80 md:h-full min-h-64 w-full object-cover"
            />

          </div>

        </div>

      </section>


      {/* Simple Information Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-10 sm:pb-16">

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Simple. Organized. Convenient.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
            Employee Portal helps make employee registration and
            information management simple. Everything can be managed
            in one convenient place, making the process easier for
            both employees and organizations.
          </p>

        </div>

      </section>
      <Footer/>

    </div>
  );
}

export default About;