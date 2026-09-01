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

// passengerRouter.post("/signup",validate(signupSchema),async (req,res)=>{
//     const {name,email,password} = req.body;
//     const duplicateCheck = await PassengerModel.findOne({email}).exec()
//     if(duplicateCheck!=null)return res.json({message:"Email already exist"});
    
//     const response = await PassengerModel.create({name,email,password});
//     return res.json({message:"User Account Created"}) 
// })

// passengerRouter.post("/signin",validate(signinSchema),async (req,res)=>{
//     const {email,password} = req.body
//     const response = await PassengerModel.findOne({email,password}).exec()
//     if(response==null)return res.status(401).json({message:"Incorrect email or password"});
//     console.log(response)
//     const token = jwt.sign({
//         _id:response._id.toString(),
//         role:"passenger" 
//     }, process.env.JWT_SECRET);
//     return res.status(200).json({token});
// })









module.exports = {passengerRouter} 