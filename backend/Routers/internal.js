const express = require("express");
const router = express.Router();

const expireSeatHolds = require("../jobs/seatHoldExpiryJob");
const { processRefund } = require("../services/refund.service");
const { createTask } = require("../config/cloudTasks");

const INTERNAL_JOB_SECRET = process.env.INTERNAL_JOB_SECRET;

if (!INTERNAL_JOB_SECRET) {
    throw new Error("INTERNAL_JOB_SECRET is not configured");
}

function verifyInternalJob(req, res, next) {
    const secret = req.headers["x-internal-job-secret"];

    if (!secret || secret !== INTERNAL_JOB_SECRET) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}

router.post("/health", verifyInternalJob, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Cloud Tasks can reach Cloud Run"
    });
});

router.post("/test-cloud-task", verifyInternalJob, async (req, res) => {
    try {
        const task = await createTask({
            path: "/internal/health",
            payload: {
                test: true
            }
        });

        return res.status(200).json({
            success: true,
            task: task.name
        });
    }
    catch (err) {
        console.error("Cloud Task creation failed:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to create Cloud Task"
        });
    }
});

router.post("/expire-seat-holds", verifyInternalJob, async (req, res) => {
    try {
        console.log("Seat hold expiry triggered");

        await expireSeatHolds();

        return res.status(200).json({
            success: true,
            message: "Seat holds expiry job completed"
        });
    }
    catch (err) {
        console.error("Seat hold expiry job failed:", err);

        return res.status(500).json({
            success: false,
            message: "Seat hold expiry job failed"
        });
    }
});

router.post("/refund", verifyInternalJob, async (req, res) => {
    try {
        console.log("Refund job triggered");
        console.log(req.body);

        const {
            _id,
            gatewayPaymentId,
            refundAmount,
            refundTrackingId
        } = req.body;

        await processRefund({
            _id,
            gatewayPaymentId,
            refundAmount,
            refundTrackingId
        });

        return res.status(200).json({
            success: true,
            message: "Refund job completed"
        });
    }
    catch (err) {
        console.error("Refund job failed:", err);

        return res.status(500).json({
            success: false,
            message: "Refund job failed"
        });
    }
});

module.exports = router;