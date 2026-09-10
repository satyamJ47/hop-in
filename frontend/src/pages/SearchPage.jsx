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

    const [compactSearch, setCompactSearch] = useState(false);

    const loadMoreController = useRef(null);

    const source = searchParams.get("src");
    const destination = searchParams.get("dest");
    const date = searchParams.get("date");

    const hasSearchParams =
        source && destination && date;

    useEffect(() => {
        if (!source || !destination || !date) {
            setRides([]);
            setNextCursor(null);
            setError(null);
            setLoading(false);
            return;
        }

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

    useEffect(() => {
        function handleScroll() {
            setCompactSearch(window.scrollY > 80);
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
        <div className="min-h-screen">

            {/* Sticky Search Bar */}
            <div
                className={`sticky top-16 z-40 border-b bg-background/95 backdrop-blur transition-all duration-300 ${
                    compactSearch ? "py-2" : "py-4"
                }`}
            >
                <div className="mx-auto max-w-5xl px-6">
                    <SearchForm compact={compactSearch} />
                </div>
            </div>

            {/* Initial State */}
            {!hasSearchParams && (
                <div className="mx-auto max-w-4xl px-6 py-16 text-center">
                    <h1 className="text-2xl font-bold">
                        Find your next ride
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        Enter your pickup location, destination,
                        and travel date to find available rides.
                    </p>
                </div>
            )}

            {/* Search Results */}
            {hasSearchParams && (
                <main className="mx-auto max-w-4xl px-6 py-8">

                    {/* Search Summary */}
                    <div className="flex items-end justify-between gap-4">
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
                            <p className="shrink-0 text-sm text-muted-foreground">
                                {rides.length}{" "}
                                {rides.length === 1
                                    ? "ride"
                                    : "rides"}
                            </p>
                        )}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                Finding available rides...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-destructive">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && !error && (
                        <>
                            {rides.length === 0 ? (
                                <div className="py-16 text-center">
                                    <h2 className="font-semibold">
                                        No rides found
                                    </h2>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        No rides are available for this
                                        route and date.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-8 space-y-4">
                                    {rides.map((ride) => (
                                        <RideCard
                                            key={ride._id}
                                            ride={ride}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Load More */}
                            {nextCursor && (
                                <div className="mt-8 flex justify-center">
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
                </main>
            )}
        </div>
    );
}