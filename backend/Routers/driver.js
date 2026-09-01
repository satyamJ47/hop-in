const {Router} = require('express')

const driverProfileRouter = Router()
const {DriverProfileModel,RideModel, VehicleModel} = require('../db')

const jwt = require('jsonwebtoken');


const {auth} = require('../Middlewares/auth');

const validate = require("../Middlewares/validation");
const { signupSchema, signinSchema } = require("../validation/driver.validation");
const getRides = require('../services/rides.service');

driverProfileRouter.get("/", auth, async (req, res) => {
    const user_id = req.user._id;

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });

    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    return res.status(200).json({
        driverProfile
    });
});

driverProfileRouter.post("/", auth, async (req, res) => {
    const user_id = req.user._id;

    // check whether profile already exists
    const existingProfile = await DriverProfileModel.findOne({ user_id });

    if (existingProfile) {
        return res.status(409).json({
            message: "Driver profile already exists"
        });
    }

    const driverProfile = await DriverProfileModel.create({
        user_id
    });

    return res.status(201).json({
        message: "Driver profile created",
        driverProfile
    });
});

// driver's rides Endpoints -> might move to new file 

// driver creates ride
driverProfileRouter.post("/ride",auth,async (req,res)=>{
    const {vehicle_id,src,dest,departure_time,fare} = req.body
    const user_id = req.user._id

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });

    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;

    const vehicle = await VehicleModel.findOne({_id:vehicle_id,owner:driver_id}).exec();
    console.log(vehicle)
    if (vehicle == null) {
        return res.status(404).json({
            message: "Invalid vehicle"
        });
    }
    const available_seats = vehicle.seats
    const response = await RideModel.create({driver_id,vehicle_id,src,dest,departure_time,available_seats,fare})
    return res.status(201).json({
        message: "Ride created",
        ride: response
    });
})

// driver edit ride -> needs to update in users as well
// but if driver change price after one user has booked and paid old price then old booked ticket should not be change for price just if he uses different vehicle then it can be changed in ticket.
driverProfileRouter.put("/ride",auth,async (req,res)=>{
    const {_id,vehicle_id,src,dest,departure_time,fare} = req.body
    
    const user_id = req.user._id

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });

    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;

    const vehicle = await VehicleModel.findOne({_id:vehicle_id,owner:driver_id})
    if(vehicle == null)return res.json({message:"Invalid Vehicle"});
    const available_seats = vehicle.seats

    const response = await RideModel.updateOne({ _id, driver_id }, {driver_id,vehicle_id,src,dest,departure_time,available_seats,fare});
    console.log(response)
    if (response.modifiedCount > 0) {
        return res.json({ message: "Ride updated" });
    }
    return res.status(400).json({ message: "No ride updated" });
})

// NEED TO WORK
// driver deletes ride -> needs to cancel ride from driver side and update in users as well
driverProfileRouter.delete("/ride",auth,async(req,res)=>{
    console.log("delete ride endpoint")
    const {_id} = req.body
    const user_id = req.user._id

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });
    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;
    const response = await RideModel.deleteOne({_id,driver_id});
    console.log(response)
    if(response.deletedCount == 0)return res.json({message:"Invalid Ride"})
    return res.json({message:"ride deleted successfully"})
})


// get list of rides created by driver
driverProfileRouter.get("/ride",auth,async(req,res)=>{
    const user_id = req.user._id
    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });
    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;
    const rides = await RideModel.find({driver_id})
    if(rides.length == 0)return res.json({message:"No rides created. Please add ride."});
    return res.json({Number:rides.length,rides})
})

driverProfileRouter.get("/rides/upcoming",auth, async(req,res)=>{
    const user_id = req.user._id

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });

    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;
    const {cursor,limit=5} = req.query;
    let query = { driver_id, departure_time:{$gt:new Date()} }
    
    const options = {cursor,type:"upcoming",limit}
    const result = await getRides(query,options);

    res.json(result);
})


driverProfileRouter.get("/rides/history",auth, async(req,res)=>{
    const user_id = req.user._id

    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });

    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const driver_id = driverProfile._id;
    const {cursor,limit=5} = req.query;
    const options = {cursor,type:"history",limit}
    let query = { driver_id, departure_time:{$lt:new Date()} }

    const result = await getRides(query,options);

    res.json(result);
})

module.exports = {
    driverProfileRouter: driverProfileRouter
}