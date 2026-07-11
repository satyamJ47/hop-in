const {Router} = require("express");
const { auth } = require("../Middlewares/auth");
const { allowRole } = require("../Middlewares/allowRole");
const { BookedRideModel, RideModel, SeatHoldModel, PaymentModel } = require("../db");
const mongoose = require("mongoose");
const { calculateRefund } = require("../utils/refundCalculator");
const razorpay = require("../config/razorpay");
const { cancelBooking } = require("../services/cancellation.service");
const { processRefund } = require("../services/refund.service");
const { createSeatHold } = require("../services/booking.service");

const rideRouter = Router();

rideRouter.get("/",(req,res)=>{
    res.send("ride router")
})

// rideRouter.post("/book",auth,allowRole("passenger"),async (req,res)=>{

//     // we can create session with any model example RideModel or BookedRideModel internally it uses mongoose.connection.startSession() 
//     // or we can use mongoose.startSession() for simplicity
//     const session = await RideModel.startSession();
//     session.startTransaction();

//     try{
//         const {_id,booked_seats} = req.body
//         const passenger_id = req.user._id

//         if (!booked_seats || booked_seats <= 0) {
//             throw new Error("Invalid seats");
//         }

//         const ride = await RideModel.findOneAndUpdate(
//             {_id,available_seats:{$gte: booked_seats}},
//             {$inc:{available_seats:-booked_seats}},
//             // {returnDocument: "after"},
//             { new: true, session }
//         );

//         console.log(ride)
    
//         if (!ride) throw new Error("Not enough seats");
    
//         const fare = ride.fare * booked_seats; 
//         await BookedRideModel.create([{
//             ride_id:_id,
//             passenger_id,
//             booked_seats,
//             fare,
//             status:"booked"
//         }],{ session })

//         await session.commitTransaction();
//         res.status(200).json({message:"Ride Booked"})

//     }
//     catch(err){
//         await session.abortTransaction();
//         res.status(400).json({ message: err.message });
//     }
//     finally{
//         session.endSession();
//     }

// })
rideRouter.post("/book",auth,allowRole("passenger"),async (req,res)=>{

    // we can create session with any model example RideModel or BookedRideModel internally it uses mongoose.connection.startSession() 
    // or we can use mongoose.startSession() for simplicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {_id,booked_seats} = req.body
        const passenger_id = req.user._id

        // function cal
        const {heldSeat,amount} = await createSeatHold({_id,booked_seats,passenger_id,session});

        await session.commitTransaction();
        return res.status(200).json({hold_id:heldSeat[0]._id,amount:amount})
  
    }
    catch(err){
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    }
    finally{
        session.endSession();
    }
});

rideRouter.post("/cancel",auth,allowRole("passenger"),async (req,res)=>{

    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        
        const _id = req.body._id;
        const cancelledSeats = req.body.cancelledSeats;
        const passenger_id = req.user._id;
        const {gatewayPaymentId,refundAmount,refundTrackingId} = await cancelBooking({_id,passenger_id,cancelledSeats,session});        
        
        await session.commitTransaction();

        console.log("after commit")
        console.log(gatewayPaymentId,refundAmount,refundTrackingId)

        await processRefund({_id,gatewayPaymentId,refundAmount,refundTrackingId})
        console.log("After Final Update")
        
        res.status(200).json({message:"Ride Cancelled"})
    }
    catch(err){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        // await session.abortTransaction();
        res.status(400).json({message:err.message})
    }
    finally{
        session.endSession();
    }
    
})

//pagination search -> traditional method
// rideRouter.post("/search",auth,allowRole("passenger"),async (req,res)=>{
//     const{src,dest,date,page} = req.query;
//     console.log(src, dest, date)
//     const start = new Date(`${date}T00:00:00+05:30`)
//     const end = new Date(`${date}T23:59:59+05:30`);

//     console.log(src, dest, start, end)

//     const rides = await RideModel.find({
//         src,
//         dest,
//         departure_time:{$gte:start,$lte:end}
//     }) 
//     .sort({ departure_time: 1,_id:1 })
//     .skip(page * 3)
//     .limit(3);

//     return res.json(rides);

// })


// infinite scroll -> optimized search
rideRouter.get("/search", async (req, res) => {
    const { src, dest, date, limit = 5, cursor } = req.query;
    
    const start = new Date(`${date}T00:00:00+05:30`)
    const end = new Date(`${date}T23:59:59+05:30`);
    let query = { src, dest, departure_time:{$gte:start,$lte:end} };

    // Decode cursor
    if (cursor) {
        
        const decoded = JSON.parse(
            Buffer.from(cursor, "base64").toString("utf-8")
        );

        query.$or = [
            { departure_time: { $gt: new Date(decoded.departure_time) } },
            {
                departure_time: new Date(decoded.departure_time),
                _id: { $gt: decoded._id }
            }
        ];
    }

    const rides = await RideModel.find(query)
        .sort({ departure_time: 1, _id: 1 })
        .limit(Number(limit));

    let nextCursor = null;

    if (rides.length > 0) {
        const lastRide = rides[rides.length - 1];

        nextCursor = Buffer.from(
            JSON.stringify({
            departure_time: lastRide.departure_time,
            _id: lastRide._id
            })
        ).toString("base64");
    }

    res.json({
        rides,
        nextCursor
    });
});

module.exports = {rideRouter}