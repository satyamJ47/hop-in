const refundQueue = require("./queues/refund.queue");

(async () => {
    await refundQueue.obliterate({ force: true });
    console.log("Queue cleared");
    process.exit(0);
})();