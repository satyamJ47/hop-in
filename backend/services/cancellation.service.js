const { default: mongoose } = require("mongoose");
const { BookedRideModel, RideModel, PaymentModel } = require("../db");
const { calculateRefund } = require("../utils/refundCalculator");

async function cancelBooking({_id,passenger_id,cancelledSeats,session}){

    console.log(_id);
    console.log(passenger_id);
    console.log(cancelledSeats);

        const booked_ride = await BookedRideModel.findOne(
            {
                _id,
                passenger_id, 
                active_seats: {
                    $gte: cancelledSeats
                }
            },
        ).session(session);

        console.log("Booked ride: ",booked_ride)
        if(!booked_ride)throw new Error("Booking not found or already cancelled or invalid seats");

        const ride = await RideModel.findOne({
            _id:booked_ride.ride_id,
            departure_time: {$gt:new Date()},
        }).session(session);

        console.log("Ride: ", ride);
        if(!ride)throw new Error("Ride already started or completed.");

        const payment = await PaymentModel.findById(booked_ride.payment_id).session(session);
        console.log("payment: \n",payment)
        if(!payment){
            throw new Error("Payment record not found");
        }
        if(payment.status !== "captured"){
            throw new Error("Payment not eligible for refund");
        }

        const cancellation_fee = 0;
        const {refundPercent,refundAmount,cancellationFee} = calculateRefund(booked_ride.fare/booked_ride.total_seats,cancelledSeats,ride.departure_time);
        console.log(refundAmount, refundPercent, cancellationFee);

        const refundTrackingId = new mongoose.Types.ObjectId();
        const booking = await BookedRideModel.findByIdAndUpdate(
             _id,
            {
                $push: {
                    refunds: {
                    _id: refundTrackingId,
                    amount: refundAmount,
                    seats: cancelledSeats,
                    cancellation_fee:cancellationFee,
                    cancelled_at: new Date(),
                    cancelled_by:"passenger",
                    }
                },
                $inc: { active_seats: -cancelledSeats, cancelled_seats: cancelledSeats, total_cancellation_fee: cancellationFee, total_refund_amount: refundAmount }
            },
            {
            returnDocument:"after",
            session
            }
        );

        if(booking.active_seats === 0){
            booking.status = "cancelled";
            await booking.save({session});
        }

        console.log("booking: ",booking)
        const response = await RideModel.findByIdAndUpdate(
            booked_ride.ride_id, 
            { $inc: { available_seats: cancelledSeats }},
            {returnDocument:"after",session}
        )
        console.log("rideResponse",response)

    return {
        gatewayPaymentId: payment.gatewayPaymentId,
        refundAmount,
        refundTrackingId
    }
        
}

module.exports = {
    cancelBooking
};

