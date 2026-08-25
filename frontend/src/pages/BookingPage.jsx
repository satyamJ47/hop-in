import { createOrder, getBookingStatus } from "@/api/payment";
import { getRide, bookRide } from "@/api/rides";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BookingPage() {
    // rideId is used as param name in AppRouter
    const {rideId} = useParams();

    const [ride,setRide] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [bookedSeats, setBookedSeats] = useState(1);
    const [booking, setBooking] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();

    useEffect(()=>{
        console.log("BookingPage effect");
        async function fetchRide() {
            try{
                const data = await getRide(rideId);
                setRide(data.ride)
                if (data.ride.available_seats === 0) {
                    setBookedSeats(0);
                }
            }catch(err){
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch ride"
                );
            }finally {
                setLoading(false);
            }
        }
        fetchRide()
    },[rideId]);

    async function waitForBooking(paymentId) {

        for (let attempt = 0; attempt < 10; attempt++) {

            const data = await getBookingStatus(paymentId);

            if (data.bookingCreated) {
                return data.bookingId;
            }

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );
        }

        throw new Error(
            "Booking confirmation is taking longer than expected."
        );
    }

    async function handleBooking() {

        // const token = localStorage.getItem("token");
        
        if(!isLoggedIn){
            navigate("/login",{
                state:{
                    from: `/rides/${rideId}/book`
                }
            })
            return;
        }

        setBooking(true);
        setBookingError(null);
        
        try{

            // step 1: hold seat
            const holdData = await bookRide({rideId,bookedSeats});
            console.log("Booking Respose",holdData)

            // step 2: create order
            const order = await createOrder(holdData.hold_id);
            console.log("Create Order",order)

            // step 3: Open Razorpay checkout
            const options = {
                key: "rzp_test_T2digepswf8o5i",
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,

                handler: async function (response) {

                    console.log("Razorpay payment:", response);

                    try {

                        const bookingId = await waitForBooking(
                            response.razorpay_payment_id
                        );

                        navigate(`/bookings/${bookingId}`);

                    } catch (err) {

                        setBookingError(
                            err.message ||
                            "Payment succeeded, but booking confirmation is taking longer than expected."
                        );

                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        }catch(err){
            setBookingError(err.response?.data?.message || "Failed to book ride")
        }finally{
            setBooking(false);
        }
    }

    if(loading){
        return <p>Loading......</p>
    }
    if(error){
        return <p className="text-destructive">{error}</p>;
    }
    // if (ride.available_seats === 0) {
    //     return (
    //         <div className="mx-auto max-w-2xl px-6 py-8">
    //             <div className="rounded-xl border bg-card p-6 shadow-sm">
    //                 <h1 className="text-2xl font-bold">
    //                     Ride Sold Out
    //                 </h1>

    //                 <p className="mt-2 text-muted-foreground">
    //                     Sorry, there are no seats available for this ride.
    //                 </p>

    //                 <Button
    //                     className="mt-6"
    //                     onClick={() => navigate(-1)}
    //                 >
    //                     Back to Rides
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
    <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold">
                Book Your Ride
            </h1>

            <p className="mt-1 text-muted-foreground">
                Review your ride and select your seats
            </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">

            {/* Ride Information */}
            <div>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            From
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            {ride.src}
                        </h2>
                    </div>

                    <span className="text-muted-foreground">
                        →
                    </span>

                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                            To
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            {ride.dest}
                        </h2>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span>
                        {format(
                            new Date(ride.departure_time),
                            "dd MMM yyyy • hh:mm a"
                        )}
                    </span>

                    <span>
                        {ride.available_seats} seats available
                    </span>
                </div>
            </div>

            {/* Booking */}
            <div className="mt-6 border-t pt-6">

                <p className="font-medium">
                    Number of seats
                </p>

                {ride.available_seats > 0 ? (
                    <div className="mt-3 flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setBookedSeats((prev) =>
                                    Math.max(1, prev - 1)
                                )
                            }
                            disabled={bookedSeats <= 1 || booking}
                        >
                            −
                        </Button>

                        <span className="w-10 text-center text-lg font-semibold">
                            {bookedSeats}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setBookedSeats((prev) =>
                                    Math.min(
                                        ride.available_seats,
                                        prev + 1
                                    )
                                )
                            }
                            disabled={
                                bookedSeats >= ride.available_seats ||
                                booking
                            }
                        >
                            +
                        </Button>
                    </div>
                ) : (
                    <div className="mt-3 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                        This ride is sold out.
                    </div>
                )}

                {/* Price Summary */}
                <div className="mt-6 space-y-3 border-t pt-5">

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Fare per seat
                        </span>

                        <span>
                            ₹{ride.fare}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Seats
                        </span>

                        <span>
                            {bookedSeats}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-4 text-xl font-bold">
                        <span>
                            Total
                        </span>

                        <span>
                            ₹{ride.fare * bookedSeats}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error */}
            {bookingError && (
                <p className="mt-4 text-sm text-destructive">
                    {bookingError}
                </p>
            )}

            {/* Payment Button */}
            <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleBooking}
                disabled={booking || ride.available_seats === 0}
            >
                {booking
                    ? "Processing..."
                    : ride.available_seats === 0
                        ? "Sold Out"
                        : "Continue to Payment"}
            </Button>

        </div>
    </div>
);
}