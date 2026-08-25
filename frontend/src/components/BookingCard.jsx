import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

export default function BookingCard({ booking }) {
    const { ride } = booking;
    const navigate = useNavigate();

    function getStatusLabel(status) {
        if (status === "booked") return "Confirmed";
        if (status === "cancelled") return "Cancelled";
        if (status === "completed") return "Completed";

        return status;
    }

    return (
        <div
            className="cursor-pointer rounded-lg border p-5 transition-colors hover:bg-muted/50"
            onClick={() => navigate(`/bookings/${booking._id}`)}
        >
            {/* Route + Status */}
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">
                    {ride.src} → {ride.dest}
                </h2>

                <Badge variant="secondary">
                    {getStatusLabel(booking.status)}
                </Badge>
            </div>

            {/* Departure */}
            <p className="mt-3 text-muted-foreground">
                {format(
                    new Date(ride.departure_time),
                    "dd MMM yyyy • hh:mm a"
                )}
            </p>

            {/* Booking Summary */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Active seats
                    </p>

                    <p className="mt-1 font-semibold">
                        {booking.active_seats}
                    </p>
                </div>

                {booking.cancelled_seats > 0 && (
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Cancelled
                        </p>

                        <p className="mt-1 font-semibold">
                            {booking.cancelled_seats}
                        </p>
                    </div>
                )}

                <div>
                    <p className="text-sm text-muted-foreground">
                        Fare
                    </p>

                    <p className="mt-1 font-semibold">
                        ₹{booking.fare}
                    </p>
                </div>
            </div>

            {/* View Details */}
            <div className="mt-4 flex items-center justify-end text-sm text-muted-foreground">
                View booking details
                <ChevronRight className="ml-1 h-4 w-4" />
            </div>
        </div>
    );
}