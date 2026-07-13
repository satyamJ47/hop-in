const razorpay = require("../config/razorpay");
const { BookedRideModel } = require("../db");

async function processRefund({_id,gatewayPaymentId,refundAmount,refundTrackingId}){
    

            let refundResponse;
    
            try{

                // throw new Error("Crash");

                // const booking = await BookedRideModel.findOne({
                //     _id,
                //     "refunds._id": refundTrackingId
                // });

                // if (!booking) {
                //     throw new Error("Booking not found");
                // }

                // const refund = booking.refunds.id(refundTrackingId);
                // if (!refund) {
                //     throw new Error("Refund record not found");
                // }
                // if (refund.refund_id) {
                //     console.log("Refund already initiated.");
                //     return;
                // }


                // efficient
                const booking = await BookedRideModel.findOne(
                    {
                        _id,
                        "refunds._id": refundTrackingId
                    },
                    {
                        "refunds.$": 1
                    }
                );
                if (!booking) {
                    throw new Error("Booking or refund record not found");
                }
                const refund = booking.refunds[0];
                if (!refund) {
                    throw new Error("Refund record not found");
                }
                if (refund.refund_id) {
                    console.log("Refund already initiated.");
                    return;
                }

                refundResponse = await razorpay.payments.refund(
                 gatewayPaymentId,
                // "pay_T5QY7rVtPHlSPn",
                {
                    "amount": Math.round(refundAmount * 100),
                    "speed": "normal",
                    "notes": {
                                "notes_key_1": "Beam me up Scotty.",
                                "notes_key_2": "Engage"
                            },
                    "receipt": refundTrackingId.toString()
                }
            )
            console.log("Refund response")
             console.log(refundResponse)
            }
            catch(err){
                console.log(err)
                throw err;
            }
    
            console.log("Before Final Update")
            const finalRes = await BookedRideModel.updateOne(
                {
                    _id,
                    "refunds._id": refundTrackingId
                },
                {
                    $set: {
                        "refunds.$.refund_id": refundResponse.id,
                        "refunds.$.status": refundResponse.status
                    }
                }
            );
            console.log(finalRes)
            if (finalRes.modifiedCount === 0) {
                throw new Error("Failed to save refund response");
            }
}

module.exports = {
    processRefund
};