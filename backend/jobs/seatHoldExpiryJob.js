const { RideModel, SeatHoldModel } = require("../db");

async function expireSeatHolds() {

  const expiredHolds = await SeatHoldModel.find({
    status: "held",
    expiresAt: { $lt: new Date() }
  });
  console.log(`Hold Seats Release`,new Date())
  // console.log(expiredHolds)
  if (expiredHolds.length > 0) {
      console.log(`Released ${expiredHolds.length} expired seat hold(s).`);
  }
  for (const hold of expiredHolds) {

    await RideModel.findByIdAndUpdate(
      hold.ride_id,
      {
        $inc: {
          available_seats: hold.seats
        }
      }
    );

    hold.status = "expired";
    hold.cleanupAt = new Date(Date.now() + 2 * 60 * 1000) //cleanup after 5 mins of release of held seat

    await hold.save();

  }
}

module.exports = expireSeatHolds;