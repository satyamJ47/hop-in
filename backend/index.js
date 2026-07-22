// testing
require("dotenv").config({
    quiet: true
});

const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const {driverRouter} = require("./Routers/driver")
const {passengerRouter} = require("./Routers/passenger")
const {rideRouter} = require("./Routers/ride")
const {vehicleRouter} = require("./Routers/vehicle")
const { paymentRouter } = require('./Routers/payment')

const connectDB = require('./config/mongodb');
const mongoose = require("mongoose");

const helmet = require("helmet");
app.use(helmet());

const cors = require("cors");
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.use(
  "/payment/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json())
app.use("/driver",driverRouter)
app.use("/passenger",passengerRouter)
app.use("/ride",rideRouter)
app.use("/vehicle",vehicleRouter)
app.use("/payment",paymentRouter)


app.get('/', (req, res) => {
  res.send('Welcome to Blah Blah! We make sure you have easy and hassle free travel experience')
})


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "hop-in-api",
    timestamp: new Date().toISOString(),
  });
});


// Wait for database to connect, logging an error if there is a problem
let server;
async function main(){
  try{
    await connectDB();
     server = app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`)
    })
  }
  catch(err){
    console.log("Connection error "+ err)
  } 
}

async function gracefulShutdown(signal) {
    console.log(`${signal} received. Shutting down...`);

    server.close(async () => {
        try {
            await mongoose.connection.close();

            console.log("MongoDB connection closed");
            console.log("Server shutdown completed");

            process.exit(0);
        } catch (err) {
            console.error("Error during shutdown:", err);
            process.exit(1);
        }
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main()


