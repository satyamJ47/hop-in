const {Router} = require("express")
const { PassengerModel, BookedRideModel, RideModel } = require("../db")
const passengerRouter = Router()
const jwt = require("jsonwebtoken")

const { allowRole } = require("../Middlewares/allowRole")
const { auth } = require("../Middlewares/auth")
const validate = require("../Middlewares/validation")
const { signupSchema, signinSchema } = require("../validation/driver.validation")
const { date, success } = require("zod")
const { default: mongoose } = require("mongoose")
const getBookings = require("../services/bookedRides.service")

passengerRouter.get("/",(req,res)=>{
    res.send("passenger router")
})

passengerRouter.post("/signup",validate(signupSchema),async (req,res)=>{
    const {name,email,password} = req.body;
    const duplicateCheck = await PassengerModel.findOne({email}).exec()
    if(duplicateCheck!=null)return res.json({message:"Email already exist"});
    
    const response = await PassengerModel.create({name,email,password});
    return res.json({message:"User Account Created"}) 
})

passengerRouter.post("/signin",validate(signinSchema),async (req,res)=>{
    const {email,password} = req.body
    const response = await PassengerModel.findOne({email,password}).exec()
    if(response==null)return res.status(401).json({message:"Incorrect email or password"});
    console.log(response)
    const token = jwt.sign({
        _id:response._id.toString(),
        role:"passenger" 
    }, process.env.JWT_SECRET);
    return res.status(200).json({token});
})

// shows booked rides upcoming 
passengerRouter.get("/bookings/upcoming",auth,allowRole("passenger"),async (req,res)=>{ 
    const {cursor} = req.query
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    const result = await getBookings({passenger_id,type:"upcoming",cursor,limit:5});
    
    return res.json(
        result
    );
})

// shows booked rides history 
passengerRouter.get("/bookings/history",auth,allowRole("passenger"),async (req,res)=>{
    const {cursor} = req.query
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    const result = await getBookings({passenger_id,type:"history",cursor,limit:5});

    return res.json(
       result
    );
})

passengerRouter.get("/bookings/:id",auth,allowRole("passenger"),async (req,res)=>{
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    // console.log(req.params.id)
    const bookedRideId = req.params.id;
    const booking = await BookedRideModel.findOne({
        _id: bookedRideId,
        passenger_id,
    })
    .populate({
        path: "ride_id",
        populate: [
            {
                path: "driver_id",
                select: "name"
            },
            {
                path: "vehicle_id",
                select: "veh_no company model color type seats"
            }
        ]
    })
    .populate({
        path: "payment_id",
        select: "status"
    });

    if(!booking)return res.status(400).json({
        success:false,
        message:"Invalid ride Id"
    })

    const response = {
        booking: {
            id: booking._id,
            status: booking.status,
            totalSeats: booking.total_seats,
            activeSeats: booking.active_seats,
            cancelledSeats: booking.cancelled_seats,
            fare: booking.fare,
            createdAt: booking.createdAt,
        },

        ride: {
            id: booking.ride_id._id,
            src: booking.ride_id.src,
            dest: booking.ride_id.dest,
            departureTime: booking.ride_id.departure_time,
        },

        driver: {
            id: booking.ride_id.driver_id._id,
            name: booking.ride_id.driver_id.name,
        },

        vehicle: {
            id: booking.ride_id.vehicle_id._id,
            number: booking.ride_id.vehicle_id.veh_no,
            company: booking.ride_id.vehicle_id.company,
            model: booking.ride_id.vehicle_id.model,
            color: booking.ride_id.vehicle_id.color,
            type: booking.ride_id.vehicle_id.type,
            seats: booking.ride_id.vehicle_id.seats,
        },

        payment: {
            id: booking.payment_id._id,
            status: booking.payment_id.status,
            amount: booking.fare,
        },

        cancellation: booking.refunds.length > 0
            ? {
                totalFee: booking.total_cancellation_fee,
                totalRefund: booking.total_refund_amount,

                refunds: booking.refunds.map((refund) => ({
                    id: refund._id,
                    seats: refund.seats,
                    amount: refund.amount,
                    cancellationFee: refund.cancellation_fee,
                    cancelledAt: refund.cancelled_at,
                    cancelledBy: refund.cancelled_by,
                    status: refund.razorpay_status,
                })),
            }
            : null,
    };


    return res.status(200).json(response);
})

// passenger profile 
passengerRouter.get("/profile",auth,allowRole("passenger"),async (req, res) => {
    const passenger = await PassengerModel
        .findById(req.user._id)
        .select("name email createdAt");

    if (!passenger) {
        return res.status(404).json({
            success: false,
            message: "Passenger not found"
        });
    }

    return res.status(200).json({
        name: passenger.name,
        email: passenger.email,
        createdAt: passenger.createdAt
    });
});

module.exports = {passengerRouter} 