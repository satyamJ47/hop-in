import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { CarFront, User } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();

    function handleLogout() {
        logout();
        toast.success("Logged out successfully");
    }

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-2"
                >
                    <CarFront className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />

                    <span className="text-xl font-bold tracking-tight">
                        Hop-In
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2">

                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        Search Rides
                    </NavLink>

                    <Link
                        to="/become-driver"
                        className="ml-2"
                    >
                        <Button variant="outline">
                            Become Driver
                        </Button>
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <div className="mx-2 h-6 w-px bg-border" />

                            <NavLink to="/my-bookings">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                    >
                                        My Bookings
                                    </Button>
                                )}
                            </NavLink>

                            <NavLink to="/profile">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        size="icon"
                                        aria-label="Profile"
                                    >
                                        <User className="h-5 w-5" />
                                    </Button>
                                )}
                            </NavLink>

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                          <div className="mx-2 h-6 w-px bg-border" />

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
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}