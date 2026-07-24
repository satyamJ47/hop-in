const { default: mongoose } = require("mongoose");
const { BookedRideModel } = require("../db");

async function getBookings(query){
    const {passenger_id,type,cursor,limit} = query;
    const pipeline = [
        {
            $match:{
                passenger_id: new mongoose.Types.ObjectId(passenger_id)
            }
        },
        {
            $lookup:{
                from: "rides",
                localField:"ride_id",
                foreignField:"_id",
                as:"ride"
            }
        },
        {
                $unwind:"$ride"
        },
    ];

    if(type === "upcoming"){
        
        pipeline.push( {
            $match:{
                "ride.departure_time":{
                    $gt:new Date()
                }
            }
        })
       
    }
    else{
        pipeline.push( {
            $match:{
                "ride.departure_time":{
                    $lt:new Date()
                }
            }
        })
    }

    if (cursor) {
        
        const decoded = JSON.parse(
            Buffer.from(cursor, "base64").toString("utf-8")
        );

        if(type === "upcoming"){
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "ride.departure_time": {
                                $gt: new Date(decoded.departure_time)
                            }
                        },
                        {
                            "ride.departure_time": new Date(decoded.departure_time),
                            _id: {
                                $gt: new mongoose.Types.ObjectId(decoded._id)
                            }
                        }
                    ]
                }
            });
            
        }
        else{
             pipeline.push({
                $match: {
                    $or: [
                        {
                            "ride.departure_time": {
                                $lt: new Date(decoded.departure_time)
                            }
                        },
                        {
                            "ride.departure_time": new Date(decoded.departure_time),
                            _id: {
                                $lt: new mongoose.Types.ObjectId(decoded._id)
                            }
                        }
                    ]
                }
            });
        }
        
    }

    if(type === 'upcoming'){
        pipeline.push(
            { $sort: { "ride.departure_time": 1, _id: 1 } },
            { $limit: limit }
        );
    }
    else {
        pipeline.push(
            { $sort: { "ride.departure_time": -1, _id: -1 } },
            { $limit: limit }
        );
    }

    const rides = await BookedRideModel.aggregate(pipeline);
    
    let nextCursor = null;
    if(rides.length>0){
        const lastRide = rides[rides.length - 1];
        nextCursor = Buffer.from(
            JSON.stringify({
                departure_time: lastRide.ride.departure_time,
                _id: lastRide._id
            })
        ).toString("base64");
    }

    return {
        rides,nextCursor
    }

}

module.exports = getBookings;