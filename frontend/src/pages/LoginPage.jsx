import { useState } from "react";
import { signin } from "@/api/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, Car } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {login} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const data = await signin({
                email,
                password,
            });

            console.log("Signin response:", data);
            // localStorage.setItem("token", data.token);
            toast.success("Login successful");
            login(data.token);

            navigate(location.state?.from || "/");
        } catch (err) {
            console.log(err)
            setError(
                err.response?.data?.message ||
                "Failed to sign in"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-6 w-6 text-primary" />
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to continue to Hop-In
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Login */}
                        <Button
                            type="submit"
                            className="h-10 w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </Button>
                    </form>

                    {/* Signup */}
                    <div className="mt-6 border-t pt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}