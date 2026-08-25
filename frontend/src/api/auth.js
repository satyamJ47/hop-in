import api from "./axios";

export async function signup({name,email,password}) {

    const response = await api.post("/passenger/signup", {
        name,
        email,
        password
    });

    return response.data;
}

export async function signin({email,password}) {

    const response = await api.post("/passenger/signin", {
        email,
        password
    });
 
    return response.data;
}