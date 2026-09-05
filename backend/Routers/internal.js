const express = require("express");
const router = express.Router();

const expireSeatHolds = require("../jobs/seatHoldExpiryJob");
const { processRefund } = require("../services/refund.service");

router.post("/expire-seat-holds", async (req, res) => {
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

router.post("/refund", async (req, res) => {
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