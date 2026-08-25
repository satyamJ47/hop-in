import api from "./axios";

export async function searchRides({src, dest, date, cursor = null,signal}) {
  const response = await api.get("/ride/search", {
    params: {
      src,
      dest,
      date,
      cursor,
    },
    signal,
  });

  return response.data;
}

export async function getRide(rideId, signal) {
    const response = await api.get(`/ride/${rideId}`, {
        signal,
    });

    return response.data;
}

// const token = "fakeTokenTest"
export async function bookRide({rideId,bookedSeats}){
  const response = await api.post("/ride/book",{
      _id: rideId,
      bookedSeats
  },
  // {
  //   headers: {
  //       token: token,
  //   },
  // }
);

  return response.data;
}

export async function getUpcomingBookings(cursor) {
    
  const response = await api.get("/passenger/bookings/upcoming",{
      params:{
        cursor,
      },
    });

    return response.data;
}

export async function getBookingHistory(cursor) {
    
  const response = await api.get("/passenger/bookings/history",{
      params:{
        cursor,
      },
    });

    return response.data;
}

export async function getBookingDetails(bookingId) {
    const response = await api.get(`/passenger/bookings/${bookingId}`);

    return response.data;
}

export async function cancelBooking(_id, cancelledSeats) {
    const response = await api.post("/ride/cancel", {
        _id,
        cancelledSeats,
    });

    return response.data;
}