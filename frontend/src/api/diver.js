import api from "./axios";

// Get current user's driver profile
export const getDriverProfile = async () => {
    const response = await api.get("/driver-profile");
    return response.data;
};

// Create driver profile
export const createDriverProfile = async () => {
    const response = await api.post("/driver-profile");
    return response.data;
};

// Create vehicle
export const createVehicle = async (vehicleData) => {
    const response = await api.post("/vehicle", vehicleData);
    return response.data;
};

// get vehicles of driver-profile
export const getVehicles = async () => {
    const response = await api.get("/vehicle");
    return response.data;
};

// create ride
export const createRide = async (rideData) => {
    const response = await api.post("driver-profile/ride", rideData);
    return response.data;
};

