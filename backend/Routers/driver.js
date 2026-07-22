const {Router} = require('express')

const driverRouter = Router()
const {DriverModel,RideModel, VehicleModel} = require('../db')

const jwt = require('jsonwebtoken');


const {auth} = require('../Middlewares/auth');
const { allowRole } = require('../Middlewares/allowRole');
const validate = require("../Middlewares/validation");
const { signupSchema, signinSchema } = require("../validation/driver.validation");

driverRouter.get("/",(req,res)=>{
    console.log("driver")
    res.send("driver router")
})

driverRouter.post("/signup",validate(signupSchema),async (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const duplicateCheck  =  await DriverModel.findOne({ email: email}).exec();
    // console.log(duplicateCheck)
    if(duplicateCheck!=null){
       return res.status(200).json({message:'Email already existed'})
    }

    const response = await DriverModel.create({ name,email,password });
    console.log(response);
    return res.json({message:`Driver ${name} is created.`})
   
})

driverRouter.post("/signin",validate(signinSchema),async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const response = await DriverModel.findOne({email,password}).exec();
    if(response == null){
        return res.json({message:"Incorrect email or password."})
    }
    console.log(response)
    const token = jwt.sign({
        _id:response._id.toString(),
        role:"driver"
    }, process.env.JWT_SECRET);
    return res.status(200).json({token:token})
})


// driver's rides Endpoints -> might move to new file 
// get list of rides created by driver
driverRouter.get("/ride",auth,allowRole("driver"), async(req,res)=>{
    const driver_id  = req.user._id
    const rides = await RideModel.find({driver_id})
    if(rides.length == 0)return res.json({message:"No rides created. Please add ride."});
    return res.json(rides)
})


// driver creates ride
driverRouter.post("/ride",auth, allowRole("driver") ,async (req,res)=>{
    const {vehicle_id,src,dest,departure_time,fare} = req.body
    const driver_id = req.user._id
    
    // const vehicle = await VehicleModel.findById(vehicle_id).exec();
    const vehicle = await VehicleModel.findOne({_id:vehicle_id,owner:driver_id}).exec();
    console.log(vehicle)
    if(vehicle == null)return res.json({message:"Invalid vehicle"})
    const available_seats = vehicle.seats
    const response = await RideModel.create({driver_id,vehicle_id,src,dest,departure_time,available_seats,fare})
    return res.json({message:"Ride created"},response)
})

// driver edit ride -> needs to update in users as well
// but if driver change price after one user has booked and paid old price then old booked ticket should not be change for price just if he uses different vehicle then it can be changed in ticket.
driverRouter.put("/ride",auth,allowRole("driver"),async (req,res)=>{
    const {_id,vehicle_id,src,dest,departure_time,fare} = req.body
    const driver_id = req.user._id
    const vehicle = await VehicleModel.findOne({_id:vehicle_id,owner:driver_id})
    if(vehicle == null)return res.json({message:"Invalid Vehicle"});
    const available_seats = vehicle.seats

    const response = await RideModel.updateOne({ _id }, {driver_id,vehicle_id,src,dest,departure_time,available_seats,fare});
    console.log(response)
    if (response.modifiedCount > 0) {
        return res.json({ message: "Ride updated" });
    }
    return res.status(400).json({ message: "No ride updated" });
})

// NEED TO WORK
// driver deletes ride -> needs to cancel ride from driver side and update in users as well
driverRouter.delete("/ride",auth,allowRole("driver"),async(req,res)=>{
    console.log("delete ride endpoint")
    const {_id} = req.body
    const driver_id = req.user._id
    const response = await RideModel.deleteOne({_id,driver_id});
    console.log(response)
    if(response.deletedCount == 0)return res.json({message:"Invalid Ride"})
    return res.json({message:"ride deleted successfully"})
})


module.exports = {
    driverRouter: driverRouter
}