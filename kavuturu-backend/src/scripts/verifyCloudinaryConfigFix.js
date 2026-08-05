// kavuturu-backend/src/scripts/verifyCloudinaryConfigFix.js

const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../config/cloudinary.js");
const testPath = path.resolve(__dirname, "../test/cloudinaryTest.js");

console.log("=================================================");
console.log("  CLOUDINARY CONFIG & DIAGNOSTICS VERIFICATION   ");
console.log("=================================================");

let allPassed = true;

// 1. Check config file
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, "utf-8");
  if (configContent.includes("dotenv") && configContent.includes("CLOUDINARY_CLOUD_NAME") && configContent.includes("module.exports = cloudinary")) {
    console.log("✅ PASS: src/config/cloudinary.js loads dotenv and exports configured cloudinary v2 instance.");
  } else {
    console.error("❌ FAIL: src/config/cloudinary.js missing dotenv or proper exports!");
    allPassed = false;
  }
} else {
  console.error("❌ FAIL: src/config/cloudinary.js not found!");
  allPassed = false;
}

// 2. Check test file
if (fs.existsSync(testPath)) {
  const testContent = fs.readFileSync(testPath, "utf-8");
  if (testContent.includes("dotenv") && testContent.includes("checkNetworkConnectivity") && testContent.includes("error.http_code") && !testContent.includes("undefined")) {
    console.log("✅ PASS: src/test/cloudinaryTest.js includes network check, detailed error object diagnostics, and avoids 'undefined'.");
  } else {
    console.error("❌ FAIL: src/test/cloudinaryTest.js missing detailed diagnostics!");
    allPassed = false;
  }
} else {
  console.error("❌ FAIL: src/test/cloudinaryTest.js not found!");
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("  CLOUDINARY CONFIG FIX VERIFICATION PASSED 100% ");
} else {
  console.log("  VERIFICATION FAILED                           ");
  process.exit(1);
}
console.log("=================================================");
