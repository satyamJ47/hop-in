const razorpay = require("../config/razorpay");
const { BookedRideModel } = require("../db");

async function processRefund({_id,gatewayPaymentId,refundAmount,refundTrackingId}){
    
            let refundResponse;
    
            try{
                refundResponse = await razorpay.payments.refund(
                 gatewayPaymentId,
                // "pay_T5QY7rVtPHlSPn",
                {
                    "amount": refundAmount*100,
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
                await BookedRideModel.updateOne(
                {
                    _id,
                    "refunds._id": refundTrackingId
                },
                {
                    $set:{
                        "refunds.$.status":"failed"
                    }
                }
                );
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
}

module.exports = {
    processRefund
};