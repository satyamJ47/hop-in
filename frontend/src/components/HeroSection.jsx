import SearchForm from "./SearchForm";

export default function HeroSection() {
    // console.log("hero");
  return (
    <section className="bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground">
          Travel Smarter, Together.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Find affordable rides, share travel costs, and connect with verified
          drivers across India.
        </p>

        <div className="mt-10 w-full max-w-5xl">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}