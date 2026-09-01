import { getRide } from "@/api/rides";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, User } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RideDetailsPage() {
    const { rideId } = useParams();
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRide() {
            try {
                const data = await getRide(rideId);
                // console.log(data)
                setRide(data.ride);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch ride"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchRide();
    }, [rideId]);

    if (loading) {
        return <p>Loading ride...</p>;
    }

    if (error) {
        return (
            <p className="text-destructive">
                {error}
            </p>
        );
    }

    if (!ride) {
        return <p>Ride not found.</p>;
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">

            <h1 className="text-3xl font-bold">
                Ride Details
            </h1>

            <p className="mt-1 text-muted-foreground">
                Review the ride before booking
            </p>

            <div className="mt-6 space-y-6">

                {/* Route & Departure */}
                <Card>
    <CardContent className="p-6">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <h2 className="text-2xl font-bold">
                    {ride.src} → {ride.dest}
                </h2>

                <p className="mt-2 text-muted-foreground">
                    {format(
                        new Date(ride.departure_time),
                        "dd MMM yyyy • hh:mm a"
                    )}
                </p>
            </div>

            <div className="sm:text-right">
                <p className="text-sm text-muted-foreground">
                    Fare per seat
                </p>

                <p className="text-2xl font-bold">
                    ₹{ride.fare}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {ride.available_seats} seats available
                </p>
            </div>

        </div>

        <div className="mt-6 border-t pt-5">
    <Button
        className="w-full"
        size="lg"
        onClick={() => navigate(`/rides/${rideId}/book`)}
        disabled={ride.available_seats === 0}
    >
        {ride.available_seats === 0
            ? "Sold Out"
            : "Book Ride"}
    </Button>
</div>

    </CardContent>
</Card>


                {/* Driver */}
                {ride.driver_id && (
                <Card>
                    <CardContent className="p-6">

                        <h2 className="text-xl font-semibold">
                            Driver & Vehicle
                        </h2>

                        <div className="mt-5 grid gap-6 sm:grid-cols-2">

                            {/* Driver */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-3">
                                    <User className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Driver
                                    </p>

                                    <p className="font-medium">
                                        {ride.driver_id.name}
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-3">
                                    <Car className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Vehicle
                                    </p>

                                    <p className="font-medium">
                                        {ride.vehicle_id.company}{" "}
                                        {ride.vehicle_id.model}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {ride.vehicle_id.veh_no}
                                    </p>
                                </div>
                            </div>

                        </div>

                    </CardContent>
                </Card>
                )}


            </div>
        </div>
    );
}