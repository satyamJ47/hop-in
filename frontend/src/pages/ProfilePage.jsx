import { getProfile } from "@/api/profile";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return (
            <p className="text-destructive">
                {error}
            </p>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-8">
            <h1 className="text-3xl font-bold">
                Profile
            </h1>

            <p className="mt-1 text-muted-foreground">
                Manage your account information
            </p>

            {profile && (
                <div className="mt-6 space-y-6">

                    {/* Personal Information */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold">
                            Personal Information
                        </h2>

                        <div className="mt-5 space-y-4">

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>

                                <p className="mt-1 font-medium">
                                    {profile.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>

                                <p className="mt-1 font-medium">
                                    {profile.email}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Account */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold">
                            Account
                        </h2>

                        <div className="mt-5">
                            <p className="text-sm text-muted-foreground">
                                Member since
                            </p>

                            <p className="mt-1 font-medium">
                                {format(
                                    new Date(profile.createdAt),
                                    "dd MMM yyyy"
                                )}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}