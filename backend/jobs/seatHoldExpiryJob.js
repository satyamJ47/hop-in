const mongoose = require("mongoose");
const { RideModel, SeatHoldModel } = require("../db");

async function expireSeatHolds() {
    const now = new Date();

    const expiredHolds = await SeatHoldModel.find({
        status: "held",
        expiresAt: { $lt: now }
    });

    console.log("Hold Seats Release", now);

    if (expiredHolds.length > 0) {
        console.log(`Found ${expiredHolds.length} expired seat hold(s).`);
    }

    for (const hold of expiredHolds) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // Atomically claim the hold for expiration.
            // If payment confirmation already changed it to
            // "confirmed", this update will match nothing.
            const expiredHold = await SeatHoldModel.findOneAndUpdate(
                {
                    _id: hold._id,
                    status: "held",
                    expiresAt: { $lt: now }
                },
                {
                    $set: {
                        status: "expired",
                        cleanupAt: new Date(Date.now() + 5 * 60 * 1000)
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!expiredHold) {
                await session.abortTransaction();

                console.log(
                    `Hold ${hold._id} was already processed. Skipping.`
                );

                continue;
            }

            // Return the seats as part of the SAME transaction.
            await RideModel.findByIdAndUpdate(
                hold.ride_id,
                {
                    $inc: {
                        available_seats: -bookedSeats,
                        booked_seats: bookedSeats,
                    }
                },
                {
                    session
                }
            );

            await session.commitTransaction();

            console.log(
                `Released ${hold.seats} seat(s) for hold ${hold._id}`
            );
        }
        catch (err) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            console.error(
                `Failed to expire hold ${hold._id}:`,
                err
            );
        }
        finally {
            await session.endSession();
        }
    }
}

module.exports = expireSeatHolds;