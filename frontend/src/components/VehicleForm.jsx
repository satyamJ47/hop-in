import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createDriverProfile, createVehicle } from "@/api/diver";


function VehicleForm() {
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState({
        veh_no: "",
        company: "",
        model: "",
        color: "",
        type: "",
        seats: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setVehicle({
            ...vehicle,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            // Step 1: create driver profile
            await createDriverProfile();

            // Step 2: create vehicle
            await createVehicle({
                ...vehicle,
                seats: Number(vehicle.seats)
            });

            // Step 3: go to driver profile
            navigate("/driver-profile");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <h2 className="text-xl font-semibold">
                Vehicle Information
            </h2>

            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            <input
                name="veh_no"
                placeholder="Vehicle Number"
                value={vehicle.veh_no}
                onChange={handleChange}
                required
            />

            <input
                name="company"
                placeholder="Company"
                value={vehicle.company}
                onChange={handleChange}
                required
            />

            <input
                name="model"
                placeholder="Model"
                value={vehicle.model}
                onChange={handleChange}
                required
            />

            <input
                name="color"
                placeholder="Color"
                value={vehicle.color}
                onChange={handleChange}
                required
            />

            <input
                name="type"
                placeholder="Vehicle Type"
                value={vehicle.type}
                onChange={handleChange}
                required
            />

            <input
                name="seats"
                type="number"
                placeholder="Number of Seats"
                value={vehicle.seats}
                onChange={handleChange}
                min="1"
                required
            />

            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating..." : "Confirm"}
            </Button>
        </form>
    );
}

export default VehicleForm;