const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const driverSchema = new Schema({
    name:String,
    email:String,
    password:String,
},{ timestamps: true })

const passengerSchema = new Schema({
    name:String,
    email:String,
    password:String,
},{ timestamps: true })

const rideSchema = new Schema({
    driver_id:ObjectId,
    vehicle_id:ObjectId ,
    src: String,
    dest: String,
    departure_time: Date,
    available_seats: Number,
    fare: Number
},{ timestamps: true })

rideSchema.index({ src: 1, dest: 1, departure_time: 1 });

const seatHoldSchema = new Schema({
  ride_id: {
    type: ObjectId,
    ref: "ride",
    required: true
  },

  passenger_id: {
    type: Schema.Types.ObjectId,
    ref: "passenger",
    required: true
  },

  seats: {
    type: Number,
    required: true,
    min: 1
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["held", "confirmed", "expired"],
    default: "held"
  },

  razorpay_order_id:String,

  expiresAt: { type: Date, required: true },

  cleanupAt: { type: Date}
  
}, { timestamps: true });

// auto-delete expired holds
seatHoldSchema.index({ cleanupAt: 1 }, { expireAfterSeconds: 0 });

const bookedRideSchema = new Schema({
  ride_id: {
    type: ObjectId,
    ref: "ride",
    required: true
  },

  passenger_id: {
    type: ObjectId,
    ref: "passenger",
    required: true
  },

  payment_id:{
    type: ObjectId,
    ref: "payment" ,
    required: true
  },

  active_seats: {
    type: Number,
    required: true,
  },

  fare: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked"
  },

  cancelled_seats:{
    type: Number,
    default:0
  },

  refunds: [{
    refund_id: String,
    amount: Number,
    cancellation_fee: Number,
    seats: Number,
    cancelled_at: Date,
    cancelled_by: {
      type: String,
      enum: ["passenger", "driver", "system"]
    },
    
    razorpay_status: {
        type: String,
        enum: ["not_initiated", "pending", "processed", "failed"],
        default: "not_initiated"
    },

    queue: {
      job_id: String,
      status: {
          type: String,
          enum: ["pending", "queued", "processing", "completed", "failed"],
          default: "pending"
      },

      updated_at: {
          type: Date,
          default: Date.now
      },

      attempts: {
          type: Number,
          default: 0
      }
    }
  }],

  total_cancellation_fee: {
    type: Number,
    default: 0
  },

  total_refund_amount: {
    type: Number,
    default: 0
  },

  total_seats:{
    type: Number,
    required: true,
  }

}, { timestamps: true });

const paymentSchema = new Schema({
  hold_id: { type: ObjectId, ref: "seat-hold" },
  gatewayOrderId: String,
  gatewayPaymentId: String,
  status: { type: String, enum: ["created", "captured", "failed"] }
}, { timestamps: true });

 
const vehicleSchema = new Schema({
    owner: ObjectId,
    veh_no: String,
    company: String,
    model: String,
    color: String,
    type: String, //Ac non Ac
    seats: Number,
},{ timestamps: true })

const DriverModel = mongoose.model("driver",driverSchema);
const PassengerModel = mongoose.model("passenger",passengerSchema);
const RideModel = mongoose.model("ride",rideSchema);
const SeatHoldModel = mongoose.model("seat-hold",seatHoldSchema);
const PaymentModel = mongoose.model("payment",paymentSchema);
const BookedRideModel = mongoose.model("booked-ride",bookedRideSchema);
const VehicleModel = mongoose.model("vehicle",vehicleSchema);

module.exports = {
    DriverModel,
    PassengerModel,
    RideModel,
    SeatHoldModel,
    PaymentModel,
    BookedRideModel,
    VehicleModel
}