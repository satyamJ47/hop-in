import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { searchRides } from "@/api/rides";
import RideCard from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import { format } from "date-fns";

export default function SearchPage() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const [nextCursor, setNextCursor] = useState(null);

    const loadMoreController = useRef(null);

    const source = searchParams.get("src");
    const destination = searchParams.get("dest");
    const date = searchParams.get("date");

    const hasSearchParams =
        source && destination && date;

    useEffect(() => {
        // No search has been performed yet
        if (!source || !destination || !date) {
            setRides([]);
            setNextCursor(null);
            setError(null);
            setLoading(false);
            return;
        }

        // Clear previous search results
        setRides([]);
        setNextCursor(null);
        setError(null);

        const controller = new AbortController();

        async function fetchRides() {
            setLoading(true);

            try {
                const data = await searchRides({
                    src: source,
                    dest: destination,
                    date,
                    signal: controller.signal,
                });

                setRides(data.rides);
                setNextCursor(data.nextCursor);
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Failed to fetch rides"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchRides();

        return () => {
            controller.abort();
            loadMoreController.current?.abort();
        };
    }, [source, destination, date]);

    async function loadMoreRides() {
        if (!nextCursor || loadingMore) {
            return;
        }

        setLoadingMore(true);
        setError(null);

        const controller = new AbortController();

        loadMoreController.current = controller;

        try {
            const data = await searchRides({
                src: source,
                dest: destination,
                date,
                cursor: nextCursor,
                signal: controller.signal,
            });

            setRides((prev) => [
                ...prev,
                ...data.rides,
            ]);

            setNextCursor(data.nextCursor);
        } catch (err) {
            if (err.code === "ERR_CANCELED") {
                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to fetch more rides"
            );
        } finally {
            setLoadingMore(false);
            loadMoreController.current = null;
        }
    }

    return (
        <>
            {/* Search Form */}
            <div className="mx-auto max-w-7xl px-6 pt-6">
                <SearchForm />
            </div>

            {/* Initial state - no search yet */}
            {!hasSearchParams && (
                <div className="mx-auto max-w-4xl px-6 pt-12 text-center">
                    <h2 className="text-xl font-semibold">
                        Find your next ride
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        Enter your pickup location, destination,
                        and travel date to find available rides.
                    </p>
                </div>
            )}

            {/* Search Results */}
            {hasSearchParams && (
                <>
                    {/* Search Summary */}
                    <div className="mx-auto max-w-4xl px-6 pt-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {source} → {destination}
                                </h1>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {format(
                                        new Date(date),
                                        "dd MMM yyyy"
                                    )}
                                </p>
                            </div>

                            {!loading && !error && (
                                <p className="text-sm text-muted-foreground">
                                    {rides.length}{" "}
                                    {rides.length === 1
                                        ? "ride"
                                        : "rides"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="mx-auto mt-8 max-w-4xl px-6">
                            <p className="text-muted-foreground">
                                Loading rides...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="mx-auto mt-8 max-w-4xl px-6">
                            <p className="text-destructive">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Rides */}
                    {!loading && !error && (
                        <>
                            <div className="mx-auto mt-8 max-w-4xl space-y-4 px-6">
                                {rides.length === 0 ? (
                                    <p className="text-muted-foreground">
                                        No rides found for this route
                                        and date.
                                    </p>
                                ) : (
                                    rides.map((ride) => (
                                        <RideCard
                                            key={ride._id}
                                            ride={ride}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Load More */}
                            {nextCursor && (
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        onClick={loadMoreRides}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore
                                            ? "Loading..."
                                            : "Load More"}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}