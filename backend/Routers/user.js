const {Router} = require('express')
const validate = require('../Middlewares/validation')
const { signinSchema, signupSchema } = require('../validation/driver.validation')
const { UserModel, BookedRideModel } = require('../db')
const jwt = require('jsonwebtoken')
const getBookings = require('../services/bookedRides.service')
const { auth } = require('../Middlewares/auth')

const userRouter = Router()

userRouter.get("/",(req,res)=>{
    console.log("user get route hit")
    return res.json({message:"user router"});
})

userRouter.post("/signup",validate(signupSchema),async (req,res)=>{
    const {name,email,password} = req.body;
    console.log(name,email,password)
    const duplicateCheck = await UserModel.findOne({email}).exec();
    if(duplicateCheck != null){
        return res.status(401).json({message:"Email already exist"});
    }

    const response = await UserModel.create({
        name,
        email,
        password,
    });
    return res.json({ message: "User Account Created" })
})

userRouter.post("/signin",validate(signinSchema),async(req,res)=>{
    const {email,password} = req.body;
    const response = await UserModel.findOne({email,password}).exec();
    if(response == null){
        return res.status(401).json({
            message: "Incorrect email or password"
        });
    }

    const token = jwt.sign({
        _id: response._id.toString()
    },process.env.JWT_SECRET);

    return res.status(200).json({ token });
})

// shows booked rides upcoming 
userRouter.get("/bookings/upcoming",auth,async (req,res)=>{ 
    const {cursor} = req.query
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    const result = await getBookings({passenger_id,type:"upcoming",cursor,limit:5});
    
    return res.json(
        result
    );
})

// shows booked rides history 
userRouter.get("/bookings/history",auth,async (req,res)=>{
    const {cursor} = req.query
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    const result = await getBookings({passenger_id,type:"history",cursor,limit:5});

    return res.json(
       result
    );
})

// booked ride
userRouter.get("/bookings/:id",auth,async (req,res)=>{
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

    console.log("RIDE:", booking.ride_id);
    console.log("DRIVER:", booking.ride_id?.driver_id);
    console.log("VEHICLE:", booking.ride_id?.vehicle_id);
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


// user profile 
userRouter.get("/profile",auth,async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("name email createdAt");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Passenger not found"
        });
    }

    return res.status(200).json({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    });
});

module.exports = {userRouter}