const razorpay = require("../config/razorpay");
const { BookedRideModel } = require("../db");

async function processRefund({_id,gatewayPaymentId,refundAmount,refundTrackingId}){
    

            let refundResponse;
    
            try{

                
                const refund = await BookedRideModel.updateOne(
                    {
                        _id,
                        refunds: {
                            $elemMatch: {
                                _id: refundTrackingId,
                                "queue.status":"queued",
                                refund_id: { $exists: false }
                            }
                        }
                    },
                    {
                        $set:{
                            "refunds.$.queue.status":"processing",
                            "refunds.$.queue.updated_at":new Date()
                        },
                        // $inc:{
                        //     "refunds.$.queue.attempts":1
                        // }
                    });
                    
                    console.log(refund)
                    // test purpose
                    // throw new Error("Crash");

                if(refund.modifiedCount == 0){
                    console.log("Refund already initiated or in processing.");
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
                        "refunds.$.razorpay_status": refundResponse.status
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