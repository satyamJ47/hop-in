import { useSearchParams} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { searchRides } from "@/api/rides";
import RideCard from "@/components/RideCard";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false); //initial loading for whole rides
    const [loadingMore, setLoadingMore] = useState(false); //load more rides spinner
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const [nextCursor, setNextCursor] = useState(null);

    const loadMoreController = useRef(null);

    const source = searchParams.get("src");
    const destination = searchParams.get("dest");
    const date = searchParams.get("date");

    console.log("render")
    console.log({rides,loading,error,loadMoreController})

    useEffect(() => {
        // console.log("Searching for", {
        //     source,
        //     destination,
        //     date,
        // });

        const controller = new AbortController();

console.log("Initial controller created:", controller);
console.log("Initial signal:", controller.signal);
        
        async function fetchRides() {

            setLoading(true);
            setError(null);

            // Artificial delay
            // await new Promise((resolve) => setTimeout(resolve, 9000));


            try {

                const data = await searchRides({
                    src: source,
                    dest: destination,
                    date,
                    signal: controller.signal,
                });

                setRides(data.rides);
                setNextCursor(data.nextCursor);

            }
            catch (err) {
                if (err.code === "ERR_CANCELED") {
                    return;
                }
                setError(err.response?.data?.message || "Failed to fetch rides");
            }
            finally {
                setLoading(false);
            }
        }

        fetchRides();
        return () => {
            //  console.log("Aborting initial controller:", controller);
    controller.abort();
    // console.log("Initial controller after abort:", controller.signal);
    
    loadMoreController.current?.abort();
        };

        console.log(controller.signal.aborted);

    }, [source, destination, date]);



    async function loadMoreRides() {
        if (!nextCursor || loadingMore) return;

        setLoadingMore(true);
        setError(null);

        const controller = new AbortController();
        loadMoreController.current = controller;

        // console.log("Load More controller created:", controller);
        // console.log("Stored in ref:", loadMoreController.current);

        //  await new Promise((resolve) => setTimeout(resolve, 9000));
        try {
            const data = await searchRides({
                src: source,
                dest: destination,
                date,
                cursor: nextCursor,
                signal: controller.signal,
            });

            setRides((prev) => [...prev, ...data.rides]);
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

    if (loading) {
        return <p>Loading rides...</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }
    return (
 
        <>
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="text-3xl font-bold">
                Search Results
            </h1>

            <p className="mt-4">
                Source: {source}
            </p>

            <p>
                Destination: {destination}
            </p>

            <p>
                Date: {date}
            </p>
        </div>

        <div className="mt-8 space-y-4">
            {rides.length === 0 ? (
                <p className="text-muted-foreground">
                    No rides found for this route and date.
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

        {nextCursor && (
            <div className="mt-6 flex justify-center">
                <Button
                    onClick={loadMoreRides}
                    disabled={loadingMore}
                >
                    {loadingMore ? "Loading..." : "Load More"}
                </Button>
            </div>
        )}

        </>
        
    );
}