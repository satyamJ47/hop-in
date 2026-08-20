import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RideCard({ ride }) {

  const navigate = useNavigate();  
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">

            <div>
                <h2 className="text-xl font-semibold">
                    {ride.src} → {ride.dest}
                </h2>
                <p className="mt-2 text-muted-foreground">
                    {ride.departure_time}
                </p>
                <p className="mt-1 text-muted-foreground">
                    {ride.available_seats} seats available
                </p>
                <p className="mt-4 text-2xl font-bold">
                    ₹{ride.fare}
                </p>
            </div>

            <Button
                 onClick={() =>
                    navigate(`/rides/${ride._id}/book`)
                }
            >
                Book Ride
            </Button>

        </div>
      </CardContent>
    </Card>
  );
}