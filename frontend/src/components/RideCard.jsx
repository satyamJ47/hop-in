import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function RideCard({ ride }) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => navigate(`/rides/${ride._id}`)}
        >
            <CardContent className="p-5">
                <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">

                    {/* Route */}
                    <div>
                        <h2 className="text-lg font-semibold">
                            {ride.src} → {ride.dest}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {ride.available_seats} seats available
                        </p>
                    </div>

                    {/* Departure */}
                    <div className="sm:text-center">
                        <p className="text-sm text-muted-foreground">
                            Departure
                        </p>

                        <p className="mt-1 font-medium">
                            {format(
                                new Date(ride.departure_time),
                                "dd MMM yyyy"
                            )}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {format(
                                new Date(ride.departure_time),
                                "hh:mm a"
                            )}
                        </p>
                    </div>

                    {/* Fare */}
                    <div className="sm:text-right">
                        <p className="text-sm text-muted-foreground">
                            Fare
                        </p>

                        <p className="mt-1 text-xl font-bold">
                            ₹{ride.fare}
                        </p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}