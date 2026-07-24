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
    return res.json({message:"User Signed In"}) 
})

passengerRouter.post("/signin",validate(signinSchema),async (req,res)=>{
    const {email,password} = req.body
    const response = await PassengerModel.findOne({email,password}).exec()
    if(response==null)return res.json({message:"Incorrect email or password"});
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
    
    return res.json({
        result
    });
})

// shows booked rides history 
passengerRouter.get("/bookings/history",auth,allowRole("passenger"),async (req,res)=>{
    const {cursor} = req.query
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    const result = await getBookings({passenger_id,type:"history",cursor,limit:5});

    return res.json({
       result
    });
})

passengerRouter.get("/booking/:id",auth,allowRole("passenger"),async (req,res)=>{
    const passenger_id = req.user._id;
    // console.log(passenger_id)
    // console.log(req.params.id)
    const bookedRideId = req.params.id;
    const ride = await BookedRideModel.findById(bookedRideId);
    if(!ride)return res.status(400).json({
        success:"false",
        message:"Invalid ride Id"
    })
    return res.status(200).json(ride);
})

module.exports = {passengerRouter} 