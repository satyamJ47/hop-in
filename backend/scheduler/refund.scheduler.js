const connectDB = require("../config/mongodb");
const { BookedRideModel, PaymentModel } = require("../db");
const refundQueue = require("../queues/refund.queue");

async function refundRecoveryScheduler() {
    try {
        console.log("Running Refund Recovery Scheduler...");

        const bookings = await BookedRideModel.find({
            refunds: {
                $elemMatch: {
                    razorpay_status: "not_initiated",
                    $or: [
                        { "queue.status": "pending" },
                        { "queue.status": "failed" }
                    ]
                }
            }
        });

        console.log(`Found ${bookings.length} booking(s)`);

        for (const booking of bookings) {

            const payment = await PaymentModel.findById(booking.payment_id);

            if (!payment) {
                console.log(`Payment not found for booking ${booking._id}`);
                continue;
            }

            for (const refund of booking.refunds) {

                if (
                    refund.razorpay_status === "not_initiated" &&
                    (
                        refund.queue.status === "pending" ||
                        refund.queue.status === "failed"
                    )
                ) {

                    console.log(
                        `Re-enqueuing refund ${refund._id} of booking ${booking._id}`
                    );

                    try {

                        const jobId = refund._id.toString();
                        const existingJob = await refundQueue.getJob(jobId);

                        if (existingJob) {
                            const state = await existingJob.getState();
                            console.log(state)
                            if (state === "failed") {
                                
                                await existingJob.remove();
                            }
                            else {
                                // Job is already waiting/active/delayed.
                                continue;
                            }
                        }

                        await refundQueue.add(
                            "refund-payment",
                            {
                                _id: booking._id,
                                gatewayPaymentId: payment.gatewayPaymentId,
                                refundAmount: refund.amount,
                                refundTrackingId: refund._id
                            },
                            {
                                jobId: refund._id.toString(),
                                attempts: 5,
                                backoff: {
                                    type: "exponential",
                                    delay: 5000
                                }
                            }
                        );

                        await BookedRideModel.updateOne(
                            {
                                _id: booking._id,
                                "refunds._id": refund._id
                            },
                            {
                                $set: {
                                    "refunds.$.queue.status": "queued",
                                    "refunds.$.queue.updated_at": new Date()
                                }
                            }
                        );

                    } catch (err) {

                        console.error(
                            `Failed to enqueue refund ${refund._id}`,
                            err.message
                        );

                    }

                }

            }

        }

    } catch (err) {
        console.error("Refund Scheduler Error:", err);
    }
}

module.exports = refundRecoveryScheduler;