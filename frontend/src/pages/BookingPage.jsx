import { useParams } from "react-router-dom";

export default function BookingPage() {
    // rideId is used as param name in AppRouter
    const {rideId} = useParams();
    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="text-3xl font-bold">
                Book Ride
            </h1>

            <p className="mt-4">
                Ride ID: {rideId}
            </p>
        </div>
    );
}