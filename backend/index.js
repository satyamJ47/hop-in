require("dotenv").config();

const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const {driverRouter} = require("./Routers/driver")
const {passengerRouter} = require("./Routers/passenger")
const {rideRouter} = require("./Routers/ride")
const {vehicleRouter} = require("./Routers/vehicle")
const { paymentRouter } = require('./Routers/payment')

const expireSeatHolds = require('./jobs/seatHoldExpiryJob');
const connectDB = require('./config/mogodb');

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



// Wait for database to connect, logging an error if there is a problem
async function main(){
  try{
    await connectDB();

    // Start background job
    await expireSeatHolds();
    setInterval(async () => {
      try {
        await expireSeatHolds();
      } catch (err) {
        console.error("Seat hold expiry job failed:", err);
      }
    }, 60 * 1000);

    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`)
    })
  }
  catch(err){
    console.log("Connection error "+ err)
  }
}

main()


