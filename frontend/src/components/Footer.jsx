import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import PopularRoutes from "./PopularRoutes";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto w-full max-w-6xl px-6 py-8">
                <div className="grid gap-8 text-center md:grid-cols-3 md:justify-items-center">
                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2"
                        >
                            <Car className="h-6 w-6" />

                            <span className="text-xl font-bold">
                                Hop-In
                            </span>
                        </Link>

                        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                            A simple and convenient ride-sharing platform
                            that connects passengers with drivers heading
                            their way.
                        </p>
                    </div>

                    {/* Popular Routes */}
                    <PopularRoutes />

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 font-semibold">
                            Quick Links
                        </h3>

                        <div className="flex flex-col items-center gap-2">
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Home
                            </Link>

                            <Link
                                to="/search"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Search Rides
                            </Link>

                            <Link
                                to="/my-bookings"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                My Bookings
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Hop-In. All rights reserved.
                </div>

            </div>
        </footer>
    );
}