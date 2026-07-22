const { RideModel, SeatHoldModel } = require("../db");

async function createSeatHold({_id,bookedSeats,passenger_id,session}) {
     console.log(_id,bookedSeats,passenger_id)
        if (!bookedSeats || bookedSeats <= 0) {
            throw new Error("Invalid seats");
        }

        const ride = await RideModel.findOneAndUpdate(
            {_id,available_seats:{$gte: bookedSeats}},
            {
                $inc:{available_seats:-bookedSeats, booked_seats:bookedSeats},
            },
            // {returnDocument: "after"},
            { new: true, session }
        );

        console.log(ride)
    
        if (!ride) throw new Error("Not enough seats");
    
        const amount = ride.fare * bookedSeats; 

        const heldSeat = await SeatHoldModel.create([{
            ride_id:_id,
            passenger_id:passenger_id,
            seats:bookedSeats,
            amount:amount,
            expiresAt:new Date(Date.now() + 2 * 60 * 1000)
        }],{session})

        return {
            heldSeat,amount
        }

}
module.exports = {
    createSeatHold
};