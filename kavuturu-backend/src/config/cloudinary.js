// src/config/cloudinary.js

const path = require("path");

// Ensure environment variables are loaded from backend .env
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { v2: cloudinary } = require("cloudinary");

// Configure Cloudinary instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : "",
  api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "",
  api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : "",
  secure: true,
});

module.exports = cloudinary;