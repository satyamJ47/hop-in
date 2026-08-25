import api from "./axios";
// const token = "fakeTokenTest"

export async function createOrder(hold_id) {
    console.log("create-order api")
    const response = await api.post("/payment/create-order", {
        hold_id,
    },
    // {
    //     headers: {
    //         token: token,
    //     },
    // }
    );

    console.log(response)

    return response.data;
}

export async function getBookingStatus(paymentId){
    const response  = await api.get(`/payment/booking-status/${paymentId}`); 
    return response.data;
}