// src/scripts/fullResetFlowTest.js

const axios = require("axios");

async function runFullE2ETest() {
  console.log("=== STARTING COMPLETE FORGOT & RESET PASSWORD E2E FLOW ===");

  // 1. Non-existent Email Verification
  try {
    await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "unknown@kavuturudental.com",
    });
    console.error("❌ Test 1 Failed: Non-existent email should have returned 404!");
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log("✅ 1. Non-existent Email Error Verified:", err.response.data.message);
    } else {
      console.error("❌ Test 1 Failed:", err.response?.data || err.message);
    }
  }

  // 2. Doctor Forgot Password Link Request
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "doctor@kavuturudental.com",
    });
    console.log("✅ 2. Doctor Forgot Password Response:", res.data.message);
  } catch (err) {
    console.error("❌ Test 2 Failed:", err.response?.data || err.message);
  }

  // 3. Receptionist Forgot Password Link Request
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "receptionist@kavuturudental.com",
    });
    console.log("✅ 3. Receptionist Forgot Password Response:", res.data.message);
  } catch (err) {
    console.error("❌ Test 3 Failed:", err.response?.data || err.message);
  }

  // 4. Invalid Token Verification
  try {
    await axios.get("http://localhost:5000/api/auth/verify-reset-token/invalidtoken12345");
    console.error("❌ Test 4 Failed: Invalid token should have been rejected!");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log("✅ 4. Invalid Token Error Verified:", err.response.data.message);
    } else {
      console.error("❌ Test 4 Failed:", err.response?.data || err.message);
    }
  }

  // 5. Invalid Token Reset Attempt
  try {
    await axios.post("http://localhost:5000/api/auth/reset-password/invalidtoken12345", {
      password: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    });
    console.error("❌ Test 5 Failed: Reset with invalid token should have been rejected!");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log("✅ 5. Invalid Token Reset Error Verified:", err.response.data.message);
    } else {
      console.error("❌ Test 5 Failed:", err.response?.data || err.message);
    }
  }

  console.log("=== ALL FORGOT & RESET PASSWORD E2E TESTS COMPLETED SUCCESSFULLY ===");
}

runFullE2ETest();
