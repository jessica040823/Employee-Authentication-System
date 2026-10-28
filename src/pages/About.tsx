import Footer from "../components/Footer";
function About() {
  return (
    <div className="min-h-screen bg-background  text-center">

      {/* About Header */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 sm:pt-8">

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          About ServiceSphere
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          A simple and convenient platform where users can explore
          different digital services and find useful information in one place.
        </p>

      </section>


      {/* About Main Section */}
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-10 sm:mt-12 sm:px-6 sm:pb-16">

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 sm:gap-10">

          {/* Left Side */}
          <div className="flex flex-col justify-center rounded-2xl bg-accent p-6 text-left shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              What is ServiceSphere?
            </h2>

            <p className="mt-4 text-base leading-7 text-foreground/80 sm:mt-6 sm:text-lg sm:leading-8">
              ServiceSphere is a web-based platform that provides
              different digital services in one place. Users can
              explore available services and view useful information
              about each service easily.
            </p>

            <p className="mt-4 text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8">
              Our goal is to make digital services easy to find,
              simple to understand, and convenient to access for everyone.
            </p>

          </div>


          {/* Right Side */}
          <div className="overflow-hidden rounded-2xl shadow-sm">

            <img
              src="/image4.jpg"
              alt="ServiceSphere"
              className="h-64 min-h-64 w-full object-cover sm:h-80 md:h-full"
            />

          </div>

        </div>

      </section>


      {/* Simple Information Section */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-16">

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Simple. Useful. Convenient.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            ServiceSphere brings different services and useful information
            together in one platform. Users can explore services, learn
            more about them, and contact us when they need additional
            information. Administrators can also manage services, users,
            and contact messages through the admin dashboard.
          </p>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default About;