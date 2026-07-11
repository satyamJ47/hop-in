const { RideModel, SeatHoldModel } = require("../db");

async function createSeatHold({_id,booked_seats,passenger_id,session}) {
     console.log(_id,booked_seats,passenger_id)
        if (!booked_seats || booked_seats <= 0) {
            throw new Error("Invalid seats");
        }

        const ride = await RideModel.findOneAndUpdate(
            {_id,available_seats:{$gte: booked_seats}},
            {$inc:{available_seats:-booked_seats}},
            // {returnDocument: "after"},
            { new: true, session }
        );

        console.log(ride)
    
        if (!ride) throw new Error("Not enough seats");
    
        const amount = ride.fare * booked_seats; 

        const heldSeat = await SeatHoldModel.create([{
            ride_id:_id,
            passenger_id:passenger_id,
            seats:booked_seats,
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