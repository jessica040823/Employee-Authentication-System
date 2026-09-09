function About() {
  return (
    <div className="min-h-screen bg-background pt-24 text-center">

      {/* About Header */}
      <section className="mx-auto max-w-6xl px-6 pt-8">

        <h1 className="text-4xl font-bold text-foreground">
          About Employee Portal
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A simple and convenient platform for managing employee
          information and registration in one place.
        </p>

      </section>


      {/* About Main Section */}
      <section className="mx-auto mt-12 max-w-6xl px-6 pb-16">

        <div className="grid items-stretch gap-10 md:grid-cols-2">

          {/* Left Side */}
          <div className="flex flex-col justify-center rounded-2xl bg-accent p-8 text-left shadow-sm">

            <h2 className="text-3xl font-bold text-foreground">
              What is Employee Portal?
            </h2>

            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Employee Portal is a simple platform designed to make
              employee registration and information management easier.
              It allows organizations to keep employee information
              organized and accessible in one place.
            </p>

            <p className="mt-4 text-lg leading-8 text-foreground/80">
              Our goal is to provide a simple and convenient system
              that helps manage employee details efficiently.
            </p>

          </div>


          {/* Right Side */}
          <div className="overflow-hidden rounded-2xl shadow-sm">

            <img
              src="/image4.jpg"
              alt="Employee Portal"
              className="h-100 w-full object-cover"
            />

          </div>

        </div>

      </section>


      {/* Simple Information Section */}
      <section className="mx-auto max-w-6xl px-6 pb-16">

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">

          <h2 className="text-3xl font-bold text-foreground">
            Simple. Organized. Convenient.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Employee Portal helps make employee registration and
            information management simple. Everything can be managed
            in one convenient place, making the process easier for
            both employees and organizations.
          </p>

        </div>

      </section>


      {/* Footer */}
      <footer className="mt-8 w-full border-b border-border bg-secondary px-3 py-3 shadow-sm">

        <p className="mt-2 text-sm font-bold text-secondary-foreground">
          © 2026 Employee Portal. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default About;