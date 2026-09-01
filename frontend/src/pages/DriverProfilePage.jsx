import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getDriverProfile, getVehicles } from "@/api/diver";



function DriverProfilePage() {
    const navigate = useNavigate();

    const [driverProfile, setDriverProfile] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const profileResponse = await getDriverProfile();
                const vehicleResponse = await getVehicles();

                setDriverProfile(
                    profileResponse.driverProfile
                );

                setVehicles(
                    vehicleResponse.vehicles
                );

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load driver profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDriverData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold">
                Driver Profile
            </h1>

            <div className="mt-6">
                <h2 className="text-lg font-semibold">
                    Driver Information
                </h2>

                <p>
                    Driver ID: {driverProfile._id}
                </p>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold">
                    Vehicles
                </h2>

                {vehicles.length === 0 ? (
                    <p>No vehicles added.</p>
                ) : (
                    vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="border rounded-lg p-4 mt-4"
                        >
                            <p>
                                {vehicle.company}{" "}
                                {vehicle.model}
                            </p>

                            <p>
                                Vehicle No: {vehicle.veh_no}
                            </p>

                            <p>
                                Color: {vehicle.color}
                            </p>

                            <p>
                                Type: {vehicle.type}
                            </p>

                            <p>
                                Seats: {vehicle.seats}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <Button
                className="mt-8"
                onClick={() => navigate("/create-ride")}
            >
                Create Ride
            </Button>
        </div>
    );
}

export default DriverProfilePage;