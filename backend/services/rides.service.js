const { default: mongoose } = require("mongoose");
const { RideModel } = require("../db");

async function getRides(query,options){

    const {cursor,type,limit} = options;

    
    // Decode cursor
    if (cursor) {
        const decoded = JSON.parse(
            Buffer.from(cursor, "base64").toString("utf-8")
        );

        console.log(decoded)

        if(type === "upcoming"){
            query.$or = [
                { departure_time: { $gt: new Date(decoded.departure_time) } },
                {
                    departure_time: new Date(decoded.departure_time),
                    _id: { $gt: new mongoose.Types.ObjectId(decoded._id) }
                }
            ];
        }
        else{
            query.$or = [
                { departure_time: { $lt: new Date(decoded.departure_time) } },
                {
                    departure_time: new Date(decoded.departure_time),
                    _id: { $lt: decoded._id }
                }
            ];
        }
        
    }

    const direction = type === "upcoming" ? 1 : -1;
    const rides = await RideModel.find(query)
        .sort({ departure_time: direction, _id: direction })
        .limit(Number(limit));

    let nextCursor = null;

    if (rides.length > 0) {
        const lastRide = rides[rides.length - 1];

        nextCursor = Buffer.from(
            JSON.stringify({
            departure_time: lastRide.departure_time,
            _id: lastRide._id
            })
        ).toString("base64");
    }

    return {rides,nextCursor};
} 

module.exports = getRides;