require("dotenv").config();

const startRefundWorker = require("./refund.worker");
const expireSeatHolds = require("../jobs/seatHoldExpiryJob");
const refundRecoveryScheduler = require("../scheduler/refund.scheduler");
const connectDB = require("../config/mongodb");
const mongoose = require("mongoose");
const connection = require("../config/redis");


async function startWorker() {
  try {

    console.log("Starting background workers...");

    // MongoDB connection
    await connectDB();

    // Start BullMQ Refund Worker
    refundWorker = await startRefundWorker();

    // Run seat hold cleanup immediately
    await expireSeatHolds();

    // Schedule seat hold cleanup
    seatHoldInterval = setInterval(async () => {
      try {
        await expireSeatHolds();
      } catch (err) {
        console.error("Seat hold expiry job failed:", err);
      }
    }, 60 * 1000);

    // Run refund recovery immediately
    await refundRecoveryScheduler();

    // Schedule refund recovery
    refundInterval = setInterval(async () => {
      try {
        await refundRecoveryScheduler();
      } catch (err) {
        console.error("Refund recovery scheduler failed:", err);
      }
    }, 5 * 60 * 1000);

    console.log("All background workers started successfully.");
  } catch (err) {
    console.error("Failed to start background workers:", err);
    process.exit(1);
  }
}

let refundWorker;
let seatHoldInterval;
let refundInterval;

startWorker();


async function gracefulShutdown(signal) {
    console.log(`${signal} received. Shutting down worker...`);

    try {

        if (seatHoldInterval) {
            console.log("Stopping seat hold scheduler...");
            clearInterval(seatHoldInterval);
        }

        if (refundInterval) {
            console.log("Stopping refund recovery scheduler...");
            clearInterval(refundInterval);
        }

        if (refundWorker){
            console.log("Closing BullMQ worker...");
            await refundWorker.close();
        }
        
        if (connection.status === "ready") {
            console.log("Closing Redis connection...");
            await connection.quit();
        }

        console.log("Closing MongoDB connection...");
        await mongoose.connection.close();

        console.log("Worker shutdown completed");

        process.exit(0);

    } catch (err) {

        console.error("Shutdown failed:", err);

        process.exit(1);
    }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));