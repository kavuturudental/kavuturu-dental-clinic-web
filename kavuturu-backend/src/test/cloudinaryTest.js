// src/test/cloudinaryTest.js

const path = require("path");
// Ensure dotenv is loaded before importing cloudinary config
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const cloudinary = require("../config/cloudinary");
const https = require("https");

/**
 * Quick network reachability check for api.cloudinary.com
 */
function checkNetworkConnectivity() {
  return new Promise((resolve) => {
    const req = https.get("https://api.cloudinary.com/v1_1/ping", { timeout: 5000 }, (res) => {
      resolve({ reachable: true, statusCode: res.statusCode });
    });
    req.on("error", (err) => {
      resolve({ reachable: false, error: err.message });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ reachable: false, error: "Connection timed out (5000ms)" });
    });
  });
}

async function testCloudinary() {
  console.log("=================================");
  console.log("   CLOUDINARY CONNECTION DIAGNOSTIC ");
  console.log("=================================");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : "";
  const apiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : "";

  console.log("Environment Variables Status:");
  console.log(` • CLOUDINARY_CLOUD_NAME: ${cloudName ? `'${cloudName}'` : "❌ EMPTY / MISSING"}`);
  console.log(` • CLOUDINARY_API_KEY:    ${apiKey ? `'${apiKey}'` : "❌ EMPTY / MISSING"}`);
  console.log(` • CLOUDINARY_API_SECRET: ${apiSecret ? "****** (Configured)" : "❌ EMPTY / MISSING"}`);
  console.log("=================================");

  // Perform Network Reachability Test
  const netStatus = await checkNetworkConnectivity();
  if (netStatus.reachable) {
    console.log(`✅ Network Connectivity: api.cloudinary.com is reachable (HTTP ${netStatus.statusCode}).`);
  } else {
    console.warn(`⚠️ Network Warning: Unable to reach api.cloudinary.com (${netStatus.error}).`);
  }
  console.log("=================================");

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ Cloudinary Configuration Error:");
    console.error("Missing required credentials in backend .env file.");
    console.error("Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in kavuturu-backend/.env.");
    console.error("=================================");
    return;
  }

  // Re-configure Cloudinary to ensure active credentials are used
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    const result = await cloudinary.api.ping();

    console.log("=================================");
    console.log("✅ Cloudinary Connected Successfully");
    console.log("Cloudinary Status:", result.status || "OK");
    console.log("Full Response:", JSON.stringify(result, null, 2));
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("❌ Cloudinary Connection Failed");
    
    if (typeof error === "object" && error !== null) {
      console.error("• Error Name:   ", error.name || "CloudinaryError");
      console.error("• Error Message:", error.message || error.error?.message || String(error));
      
      if (error.http_code || error.error?.http_code) {
        console.error("• HTTP Status:  ", error.http_code || error.error?.http_code);
      }
      
      if (error.request_options) {
        console.error("• Request Path: ", `${error.request_options.protocol}//${error.request_options.hostname}${error.request_options.path}`);
      }

      console.error("• Error Object Structure:");
      console.error(JSON.stringify(error, null, 2));
      
      if (error.stack) {
        console.error("• Stack Trace:\n", error.stack);
      }
    } else {
      console.error("• Raw Error:", error);
    }
    console.error("=================================");
  }
}

testCloudinary();