const refundQueue = require("./queues/refund.queue");

// (async () => {
//     console.log("Waiting", (await refundQueue.getWaiting()).length);

// console.log("Active", (await refundQueue.getActive()).length);

// console.log("Delayed", (await refundQueue.getDelayed()).length);

// console.log("Failed", (await refundQueue.getFailed()).length);

// console.log("Completed", (await refundQueue.getCompleted()).length);
// })();

setInterval(async () => {
    console.log({
        waiting: (await refundQueue.getWaiting()).length,
        active: (await refundQueue.getActive()).length,
        delayed: (await refundQueue.getDelayed()).length,
        failed: (await refundQueue.getFailed()).length,
        completed: (await refundQueue.getCompleted()).length,
    });
}, 1000);
async function check() {
    
    // const job = await refundQueue.getJob("6a5a09c1b60fe63ec17674a5");
    // console.log(job);
    
    const job = await refundQueue.getJob(
        "6a5a09c1b60fe63ec17674a5"
    );

    console.log(await job.getState());
}
check();
