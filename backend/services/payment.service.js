const { default: mongoose } = require("mongoose");
const { BookedRideModel, PaymentModel, SeatHoldModel } = require("../db");

async function handlePaymentSuccess(payment) {
  console.log("payment success")
  const razorpay_order_id = payment.order_id; // pass this during order creation
  console.log(payment)
  console.log(razorpay_order_id)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hold = await SeatHoldModel.findOne({razorpay_order_id}).session(session);

    if (!hold || hold.status !== "held") {
      throw new Error("Invalid hold");
    }

    // Confirm hold
    hold.status = "confirmed";
    await hold.save({ session });

    // update payment_id
    paymentReciept = await PaymentModel.findOne({gatewayOrderId:razorpay_order_id}).session(session);
    console.log("gatewayPaymet status = ",payment.status)
    paymentReciept.status = payment.status;
    paymentReciept.gatewayPaymentId = payment.id;
    await paymentReciept.save({session}); 
    // Create booking
    await BookedRideModel.create([{
      ride_id: hold.ride_id,
      passenger_id: hold.passenger_id,
      payment_id: paymentReciept._id,
      active_seats: hold.seats,
      fare: hold.amount,
      total_seats:hold.seats,
      status: "booked"
    }], { session });

    await session.commitTransaction();
    session.endSession();

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
  }
}

async function handlePaymentFailure(payment) {

    const razorpay_order_id = payment.order_id;
    console.log(`Payment Failed for ${razorpay_order_id}. Please try again.`)
    console.log("payment = \n",payment)
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const hold = await SeatHoldModel.findOne({razorpay_order_id}).session(session);
        
        const paymentReciept = await PaymentModel.findOne({gatewayOrderId:razorpay_order_id}).session(session);
        if(!paymentReciept)throw new error("Invalid payment reciept");
        
        paymentReciept.status = payment.status;
        paymentReciept.gatewayPaymentId = payment.id;
        await paymentReciept.save({session});

        await session.commitTransaction();
    }
    catch(err){
      await session.abortTransaction()
      console.error(err)
    }
    finally{
      session.endSession()
    }
    
}

async function handleRefundCreated(payment,refund){
  console.log("refund created")
  console.log(payment)
  console.log(refund)
  await BookedRideModel.updateOne(
    {
      "refunds.refund_id": refund.id
    },
    {
      $set:{
        "refunds.$.razorpay_status":"created"
      }
    }
  );
}

async function handleRefundSuccess(payment,refund){
  console.log("refund successful")
  console.log(payment)
  console.log(refund)
  await BookedRideModel.updateOne(
    {
      "refunds.refund_id": refund.id
      },
      {
        $set:{
          "refunds.$.razorpay_status":"processed"
        }
      }
    );
  }
  
  async function handleRefundFailure(refund){
    console.log("refund failure")
    
    await BookedRideModel.updateOne(
      {
         "refunds.refund_id": refund.id
      },
      {
         $set:{
            "refunds.$.razorpay_status":"failed"
         }
      }
   );
}

module.exports = {
    handlePaymentSuccess,
    handlePaymentFailure,
    handleRefundCreated,
    handleRefundSuccess,
    handleRefundFailure
}