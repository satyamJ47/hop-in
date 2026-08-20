import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  console.log("Navbar");
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-foreground transition-colors hover:text-primary"
        >
          🚗 Hop-In
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/search"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Search Rides
          </Link>

          <Button variant="outline">
            Become Driver
          </Button>

          <Link to="/login">
            <Button variant="ghost">
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}