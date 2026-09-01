const {Router} = require('express')
const { model } = require('mongoose')
const { auth } = require('../Middlewares/auth')
const { VehicleModel, DriverProfileModel } = require('../db')
const validate = require('../Middlewares/validation')
const { vehicleSchema, updateVehicleSchema, deleteVehicleSchema } = require('../validation/driver.validation')

const vehicleRouter = Router()

vehicleRouter.get("/",auth,async (req,res)=>{
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
    const vehicles = await VehicleModel.find({owner:driver_id})
    if (vehicles.length === 0) {
        return res.status(200).json({
            vehicles: []
        });
    }

    return res.status(200).json({
        vehicles
    });
})

vehicleRouter.post("/", auth,validate(vehicleSchema),async (req,res)=>{
    const {veh_no,company,model,color,type,seats} = req.body;
    const user_id = req.user._id
    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });
    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const owner = driverProfile._id;
    const response = await VehicleModel.create({
        owner,veh_no,company,model,color,type,seats
    })
    console.log(response)
    return res.json({message:"Vehicle added"})
})

// update vehicle ->
// Possibility of
vehicleRouter.put("/",auth,validate(updateVehicleSchema),async (req,res)=>{
    const {_id,veh_no,company,model,color,type,seats} = req.body;
    const user_id = req.user._id
    const driverProfile = await DriverProfileModel.findOne({
        user_id
    });
    if (!driverProfile) {
        return res.status(404).json({
            message: "Driver profile not found"
        });
    }

    const owner = driverProfile._id;
    const response = await VehicleModel.updateOne(
        {_id,owner},
        {veh_no,company,model,color,type,seats}
    );
    console.log(response)
    if(response.modifiedCount>=1){
        return res.json({message:"Vehicle updated"})
    }
    return res.json({message:"Invalid details"})
})

// NEED TO WORK ->  show warning if this vehicle is added for some rides then driver needs to add other vehicle there or cancel/delete ride
// delete vehicle
vehicleRouter.delete("/",auth,validate(deleteVehicleSchema),async (req,res)=>{
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

    const owner = driverProfile._id;
    const response = await VehicleModel.findOneAndDelete(
        {_id,owner}
    );
    console.log(response)
     if (!response) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted",
    });
})

module.exports = {vehicleRouter}