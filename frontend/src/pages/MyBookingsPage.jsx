import { getBookingHistory, getUpcomingBookings } from "@/api/rides";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function MyBookingsPage() {
    const [bookings,setBookings] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [loadingMore,setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState("upcoming");


    async function fetchBookings(cursor = null) {

            if (cursor) {
                setLoadingMore(true);
            }

            // ARTIFICIAL DELAY
            //  await new Promise((resolve) => setTimeout(resolve, 6000));

        try{
            const data = activeTab==="upcoming" ? await getUpcomingBookings(cursor) : await getBookingHistory(cursor);
            // console.log(data)
            if (cursor) {
                setBookings((prev) => [
                    ...prev,
                    ...data.rides
                ]);
            } else {
                setBookings(data.rides);
            }

            setNextCursor(data.nextCursor);
        }catch(err){
            setError(
                err.response?.data?.message ||
                "Failed to fetch bookings"
            );
        }finally{
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(()=>{
        setLoading(true);
        setError(null);
        setBookings([]);
        setNextCursor(null);
        
        fetchBookings();
    },[activeTab]);


   

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="text-3xl font-bold">
                My Bookings
            </h1>

            <div className="mt-6 flex gap-2 border-b">
                <Button
                    variant={activeTab === "upcoming" ? "default" : "ghost"}
                    onClick={() => setActiveTab("upcoming")}
                >
                    Upcoming
                </Button>

                <Button
                    variant={activeTab === "history" ? "default" : "ghost"}
                    onClick={() => setActiveTab("history")}
                >
                    History
                </Button>
            </div>

            {loading && (
                <p className="mt-6">
                    Loading bookings...
                </p>
            )}

            {error && (
                <p className="mt-6 text-destructive">
                    {error}
                </p>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="mt-8 rounded-lg border p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        {activeTab === "upcoming"
                            ? "No upcoming bookings"
                            : "No booking history"}
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        {activeTab === "upcoming"
                            ? "You don't have any upcoming rides."
                            : "You don't have any previous rides."}
                    </p>
                </div>
            )}

            {!loading && !error && bookings.length>0 && (
                <>
                    <div className="mt-6 space-y-4">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        ))}
                    </div>

                    {nextCursor && (
                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={()=>fetchBookings(nextCursor)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}