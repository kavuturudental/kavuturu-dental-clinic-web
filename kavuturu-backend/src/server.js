// src/server.js

require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Express Server
connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection error:", err.message);
        process.exit(1);
    });