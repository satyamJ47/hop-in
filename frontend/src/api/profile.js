import api from "./axios";

export async function getProfile() {
    const response = await api.get("/passenger/profile");
    console.log(response)
    return response.data;
}