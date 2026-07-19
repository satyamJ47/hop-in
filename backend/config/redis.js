const { Redis } = require("ioredis");

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
});

connection.on("connect", () => {
    console.log("Connecting to Redis...");
});

connection.on("ready", () => {
    console.log("Connected to Redis");
});

connection.on("error", (err) => {
    console.error("Redis Error:", err);
});

connection.on("close", () => {
    console.log("Redis connection closed");
});

module.exports = connection;