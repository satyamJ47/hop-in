const {Router} = require('express')
const { model } = require('mongoose')
const { auth } = require('../Middlewares/auth')
const { VehicleModel } = require('../db')
const { allowRole } = require('../Middlewares/allowRole')

const vehicleRouter = Router()

vehicleRouter.get("/",auth,allowRole("driver"),async (req,res)=>{
    const driver_id = req.user._id
    const vehicles = await VehicleModel.find({owner:driver_id})
    if(vehicles.length==0)return res.json({message:"Please add vechicles"})
    return res.json(vehicles)
})

vehicleRouter.post("/", auth,allowRole("driver"),async (req,res)=>{
    const {veh_no,company,model,color,type,seats} = req.body;
    const owner = req.user._id
    const response = await VehicleModel.create({
        owner,veh_no,company,model,color,type,seats
    })
    console.log(response)
    return res.json({message:"Vehicle added"})
})

// update vehicle ->
// Possibility of
vehicleRouter.put("/",auth,allowRole("driver"),async (req,res)=>{
    const {_id,veh_no,company,model,color,type,seats} = req.body;
    const owner = req.user._id
    const response = await VehicleModel.updateOne(
        {_id},
        {owner,veh_no,company,model,color,type,seats}
    );
    console.log(response)
    if(response.modifiedCount>=1){
        return res.json({message:"Vehicle updated"})
    }
    return res.json({message:"Invalid details"})
})

// NEED TO WORK ->  show warning if this vehicle is added for some rides then driver needs to add other vehicle there or cancel/delete ride
// delete vehicle
vehicleRouter.delete("/",auth,allowRole("driver"),async (req,res)=>{
    const {_id} = req.body
    const owner = req.user._id
    await VehicleModel.findOneAndDelete(
        {_id,owner}
    );
    return res.json({message:"Vehicle deleted"})
})



module.exports = {vehicleRouter}