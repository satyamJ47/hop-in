import api from "./axios";

export async function signup({name,email,password}) {
    
    const response = await api.post("/user/signup", {
        name,
        email,
        password
    });
    
    return response.data;
}

export async function signin({email,password}) {
    const response = await api.post("/user/signin", {
        email,
        password
    });
 
    return response.data;
}