const express = require("express")
const paymentRouter = express.Router()
require('dotenv').config()

const {auth} = require('../Middlewares/auth');
const crypto = require("crypto");

const Razorpay = require("razorpay");
const { SeatHoldModel, BookedRideModel, RideModel, PaymentModel } = require("../db");
const { default: mongoose } = require("mongoose");
const { error } = require("console");
const razorpay = require("../config/razorpay");
const { handlePaymentFailure, handleRefundCreated, handleRefundSuccess, handleRefundFailure, handlePaymentSuccess } = require("../services/payment.service");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


paymentRouter.post("/create-order", auth, async (req, res) => {
    try{
        const { hold_id } = req.body;

        const hold = await SeatHoldModel.findById(hold_id);
        if (!hold || hold.status !== "held") {
          return res.status(400).json({ message: "Invalid hold" });
        }

        const order = await razorpay.orders.create({
          amount: hold.amount * 100, // paise
          currency: "INR",
          receipt: hold_id.toString()
        });
        console.log(order)
        hold.razorpay_order_id = order.id;
        await hold.save();

        const payment = await PaymentModel.create({
          hold_id,
          gatewayOrderId: order.id,
          status: order.status
        })
        console.log(payment)
        return res.json(order,payment);
    }
    catch(err){
        console.error("Webhook Error:", err);

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed"
        });
    }
}); 

function verifyWebhookSignature(body, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === signature;
}

paymentRouter.post("/webhook", async (req, res) => {
    try{

        console.log("webhook")
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
        const signature = req.headers["x-razorpay-signature"];
        console.log(secret,signature)

        const isValid = verifyWebhookSignature(
          req.body, // raw buffer
          signature,
          secret
        );

        if (!isValid) {
          return res.status(400).json({ message: "Invalid signature" });
        }

        const event = JSON.parse(req.body.toString());
        console.log(event)
        // Handle event
        if (event.event === "payment.captured") {
          await handlePaymentSuccess(event.payload.payment.entity);
        }

        if (event.event === "payment.failed") {
          await handlePaymentFailure(event.payload.payment.entity);
        }

        if(event.event === "refund.created"){
          await handleRefundCreated (event.payload.payment.entity,event.payload.refund.entity) 
        }
        if(event.event === "refund.processed"){
          await handleRefundSuccess(event.payload.payment.entity,event.payload.refund.entity)
        }
        if(event.event === "refund.failed"){
          await handleRefundFailure(event.payload.payment.entity)
        }

        return res.json({ status: "ok" });

    }
    catch(err){
      console.error("Webhook Error:", err);

      return res.status(500).json({
          success: false,
          message: "Webhook processing failed"
      });
    }
});



module.exports = {paymentRouter}