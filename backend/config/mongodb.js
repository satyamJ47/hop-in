require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("MongoDB Connection Failed");
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;