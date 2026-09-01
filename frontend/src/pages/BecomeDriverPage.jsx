import { useState } from "react";
import { Button } from "@/components/ui/button";
import VehicleForm from "../components/VehicleForm";

function BecomeDriverPage() {
    const [showVehicleForm, setShowVehicleForm] = useState(false);

    return (
        <div className="max-w-2xl mx-auto py-10">
            {!showVehicleForm ? (
                <div>
                    <h1 className="text-2xl font-bold">
                        Become a Driver
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        You need to complete your driver profile
                        before you can offer a ride.
                    </p>

                    <Button
                        className="mt-6"
                        onClick={() => setShowVehicleForm(true)}
                    >
                        Continue
                    </Button>
                </div>
            ) : (
                <VehicleForm />
            )}
        </div>
    );
}

export default BecomeDriverPage;