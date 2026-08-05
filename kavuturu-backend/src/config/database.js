// config/database.js

const mongoose = require("mongoose");

let isConnected = false;

/**
 * Connect to MongoDB Atlas
 */
const connectDatabase = async () => {
    try {
        // Validate environment variable
        if (!process.env.MONGODB_URI) {
            console.error("❌ MONGODB_URI is missing in .env file");
            process.exit(1);
        }

        // Return if already connected
        if (isConnected) {
            console.log("ℹ️ MongoDB is already connected.");
            return;
        }

        // Connect to MongoDB
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log("✅ MongoDB Connected Successfully");
        console.log(`📂 Database : ${connection.connection.name}`);
        console.log(`🖥️ Host     : ${connection.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
};

/**
 * MongoDB Connection Events
 */

// Connected
mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connection established.");
});

// Reconnected
mongoose.connection.on("reconnected", () => {
    console.log("🟢 MongoDB reconnected.");
});

// Disconnected
mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("🟡 MongoDB disconnected.");
});

// Error
mongoose.connection.on("error", (error) => {
    console.error("🔴 MongoDB Error:", error.message);
});

/**
 * Close MongoDB Connection
 */
const closeDatabase = async () => {
    try {
        await mongoose.connection.close();

        console.log("🛑 MongoDB connection closed.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error closing MongoDB connection.");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = {
    connectDatabase,
    closeDatabase,
};