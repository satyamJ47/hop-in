const { default: mongoose } = require("mongoose");
const { BookedRideModel, PaymentModel, SeatHoldModel } = require("../db");

async function handlePaymentSuccess(payment) {
    console.log("Payment success:", payment.id);

    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;
    console.log("___________________");
    console.log(razorpayOrderId,razorpayPaymentId);
    console.log("___________________");

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Find our payment record using Razorpay Order ID
        const paymentReceipt = await PaymentModel.findOne({
            gatewayOrderId: razorpayOrderId
        }).session(session);

        if (!paymentReceipt) {
            throw new Error("Invalid payment receipt");
        }

        // 2. Idempotency check
        // If this payment has already been processed,
        // the booking should already exist.
        if (
            paymentReceipt.status === "captured" &&
            paymentReceipt.gatewayPaymentId === razorpayPaymentId
        ) {
            console.log(
                `Payment ${razorpayPaymentId} already processed`
            );

            await session.commitTransaction();
            return;
        }

        // 3. Find the corresponding seat hold
        const hold = await SeatHoldModel.findOne({
            razorpay_order_id: razorpayOrderId
        }).session(session);

        if (!hold) {
            throw new Error("Invalid hold");
        }

        // 4. Confirm the hold
        //
        // If the hold is already confirmed, that's okay.
        // This makes the operation safe if we encounter
        // an already-processed webhook.
        if (hold.status === "held") {
            hold.status = "confirmed";
            await hold.save({ session });
        } else if (hold.status !== "confirmed") {
            throw new Error(
                `Invalid hold status: ${hold.status}`
            );
        }

        // 5. Update our payment record
        paymentReceipt.status = "captured";
        paymentReceipt.gatewayPaymentId = razorpayPaymentId;

        await paymentReceipt.save({ session });

        // 6. Check whether a booking already exists
        const existingBooking = await BookedRideModel.findOne({
            payment_id: paymentReceipt._id
        }).session(session);

        // 7. Create booking only if it doesn't exist
        if (!existingBooking) {
            await BookedRideModel.create(
                [{
                    ride_id: hold.ride_id,
                    passenger_id: hold.passenger_id,
                    payment_id: paymentReceipt._id,
                    active_seats: hold.seats,
                    fare: hold.amount,
                    total_seats: hold.seats,
                    status: "booked"
                }],
                { session }
            );

            console.log(
                `Booking created for payment ${razorpayPaymentId}`
            );
        } else {
            console.log(
                `Booking already exists for payment ${razorpayPaymentId}`
            );
        }

        await session.commitTransaction();

    } catch (err) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error(
            "Payment success handling failed:",
            err
        );

        // IMPORTANT:
        // Let the webhook route know that processing failed.
        // Otherwise the webhook could incorrectly return 200.
        throw err;

    } finally {
        await session.endSession();
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
        if(!paymentReciept)throw new Error("Invalid payment reciept");
        
        paymentReciept.status = payment.status;
        paymentReciept.gatewayPaymentId = payment.id;
        await paymentReciept.save({session});

        await session.commitTransaction();
    }
    catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Payment failure handling failed:", err);
        throw err;
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