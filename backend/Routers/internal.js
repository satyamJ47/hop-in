const express = require("express");
const router = express.Router();

const expireSeatHolds = require("../jobs/seatHoldExpiryJob");

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

module.exports = router;