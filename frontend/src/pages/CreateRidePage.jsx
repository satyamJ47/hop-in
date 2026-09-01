import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { createRide, getVehicles } from "@/api/diver";



function CreateRidePage() {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    const [formData, setFormData] = useState({
        vehicle_id: "",
        src: "",
        dest: "",
        departure_time: "",
        fare: ""
    });

    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedVehicle = vehicles.find(
        (vehicle) => vehicle._id === formData.vehicle_id
    );

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getVehicles();

                setVehicles(data.vehicles || []);

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load vehicles"
                );
            } finally {
                setLoadingVehicles(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const rideData = {
                vehicle_id: formData.vehicle_id,
                src: formData.src,
                dest: formData.dest,
                departure_time: formData.departure_time,
                fare: Number(formData.fare)
            };

            const response = await createRide(rideData);

            // console.log("Ride created:", response);

            setSuccess("Ride created successfully!");

            setTimeout(() => {
                navigate("/driver-profile");
            }, 1000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create ride"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingVehicles) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <p>Loading vehicles...</p>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <h1 className="text-2xl font-bold">
                    Create Ride
                </h1>

                <p className="mt-4 text-muted-foreground">
                    You need to add a vehicle before creating a ride.
                </p>

                <Button
                    className="mt-6"
                    onClick={() => navigate("/driver-profile")}
                >
                    Go to Driver Profile
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold">
                Create a Ride
            </h1>

            <p className="mt-2 text-muted-foreground">
                Enter the details of the ride you want to offer.
            </p>

            {error && (
                <p className="mt-4 text-red-500">
                    {error}
                </p>
            )}

            {success && (
                <p className="mt-4 text-green-600">
                    {success}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
            >
                {/* Vehicle */}

                <div>
                    <label className="block mb-2 font-medium">
                        Vehicle
                    </label>

                    <select
                        name="vehicle_id"
                        value={formData.vehicle_id}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2"
                    >
                        <option value="">
                            Select a vehicle
                        </option>

                        {vehicles.map((vehicle) => (
                            <option
                                key={vehicle._id}
                                value={vehicle._id}
                            >
                                {vehicle.company} {vehicle.model} - {vehicle.veh_no} ({vehicle.seats} seats)
                            </option>
                        ))}
                    </select>
                </div>

                {selectedVehicle && (
                    <div className="mt-3">
                        <label className="block mb-2 font-medium">
                            Available Seats
                        </label>

                        <div className="w-full border rounded-md p-2 bg-muted">
                            {selectedVehicle.seats} seats
                        </div>
                    </div>
                )}
                
                {/* Source */}

                <div>
                    <label className="block mb-2 font-medium">
                        From
                    </label>

                    <input
                        name="src"
                        value={formData.src}
                        onChange={handleChange}
                        placeholder="Enter source"
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>

                {/* Destination */}

                <div>
                    <label className="block mb-2 font-medium">
                        To
                    </label>

                    <input
                        name="dest"
                        value={formData.dest}
                        onChange={handleChange}
                        placeholder="Enter destination"
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>

                {/* Departure */}

                <div>
                    <label className="block mb-2 font-medium">
                        Departure Time
                    </label>

                    <input
                        type="datetime-local"
                        name="departure_time"
                        value={formData.departure_time}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>

                {/* Fare */}

                <div>
                    <label className="block mb-2 font-medium">
                        Fare per Seat
                    </label>

                    <input
                        type="number"
                        name="fare"
                        value={formData.fare}
                        onChange={handleChange}
                        min="0"
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                >
                    {submitting
                        ? "Creating Ride..."
                        : "Create Ride"}
                </Button>
            </form>
        </div>
    );
}

export default CreateRidePage;