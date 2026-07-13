const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { processRefund } = require("../services/refund.service");
const connectDB = require("../config/mongodb");
const { BookedRideModel } = require("../db");

async function startWorker(){

    await connectDB();
    console.log("Refund Worker Started");
    const worker = new Worker(
        "refundQueue",
        async (job) => {
            console.log("Received Job");
            console.log(job.data);

            await processRefund(job.data);
        },
        { connection }
    );

    worker.on("completed", job => {
        console.log("Completed", job.id);
    });

     worker.on("failed", async(job, err) => {
        console.log("Failed", job.id);
        console.error(err);
        console.log("Attempt:", job.attemptsMade);
        console.log("Remaining:", job.opts.attempts - job.attemptsMade);

        if (job.attemptsMade === job.opts.attempts) {

            await BookedRideModel.updateOne(
                {
                    _id: job.data._id,
                    "refunds._id": job.data.refundTrackingId
                },
                {
                    $set:{
                        "refunds.$.status":"failed"
                    }
                }
            );

        }

    });
}


startWorker();


