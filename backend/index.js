// testing
require("dotenv").config({
    quiet: true
});

const express = require('express')
const app = express()

const cors = require("cors");

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.path);
    console.log("ORIGIN:", req.headers.origin);
    next();
});

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));
// console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// changed for multiple frontend URLs
const allowedOrigins = [
    "http://localhost:5173",
    "https://hop-in.in",
    "https://www.hop-in.in",
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const PORT = process.env.PORT || 3000


const {driverProfileRouter} = require("./Routers/driver")
const {passengerRouter} = require("./Routers/passenger")
const {userRouter} = require("./Routers/user")
const {rideRouter} = require("./Routers/ride")
const {vehicleRouter} = require("./Routers/vehicle")
const { paymentRouter } = require('./Routers/payment')

const connectDB = require('./config/mongodb');
const mongoose = require("mongoose");

const helmet = require("helmet");
app.use(helmet());




app.use(
  "/payment/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json())
app.use("/driver-profile",driverProfileRouter)
app.use("/passenger",passengerRouter)
app.use("/user",userRouter)
app.use("/ride",rideRouter)
app.use("/vehicle",vehicleRouter)
app.use("/payment",paymentRouter)


app.get('/', (req, res) => {
  res.send('Welcome to Blah Blah! We make sure you have easy and hassle free travel experience')
})


app.get("/health", (req, res) => {
  console.log("health enpoint hit")
  res.status(200).json({
    status: "UP",
    service: "hop-in-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/version", (req, res) => {
  console.log("version")
    res.json({
        version: "1.0.1",
        deployed: "CI/CD Test",
    });
});

// Wait for database to connect, logging an error if there is a problem
let server;
async function main(){
  try{
    await connectDB();
     server = app.listen(PORT, () => {
      // console.log(`Example app listening on port http://localhost:${port}`)
      console.log(`Hop-In API started on port ${PORT}`);
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

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

main()


