// src/scripts/runForgotE2E.js

const axios = require("axios");

async function runTest() {
  console.log("=== FORGOT & RESET PASSWORD E2E SUITE ===");

  // Step 1: Request reset for non-existent email
  try {
    await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "nonexistent@kavuturudental.com",
    });
    console.error("❌ Test 1 Failed: Non-existent email should have returned 404!");
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log("✅ Test 1 Passed: Non-existent email returned 404 with message:", err.response.data.message);
    } else {
      console.error("❌ Test 1 Error:", err.response?.data || err.message);
    }
  }

  // Step 2: Request reset link for Doctor email
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "doctor@kavuturudental.com",
    });
    console.log("✅ Test 2 Passed: Doctor forgot-password returned:", res.data.message);
  } catch (err) {
    console.error("❌ Test 2 Failed:", err.response?.data || err.message);
  }

  // Step 3: Request reset link for Receptionist email
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "receptionist@kavuturudental.com",
    });
    console.log("✅ Test 3 Passed: Receptionist forgot-password returned:", res.data.message);
  } catch (err) {
    console.error("❌ Test 3 Failed:", err.response?.data || err.message);
  }

  // Step 4: Verify invalid token returns error
  try {
    await axios.get("http://localhost:5000/api/auth/verify-reset-token/invalidtoken999");
    console.error("❌ Test 4 Failed: Invalid token should have failed!");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log("✅ Test 4 Passed: Invalid token returned 400 with message:", err.response.data.message);
    } else {
      console.error("❌ Test 4 Error:", err.response?.data || err.message);
    }
  }

  // Step 5: Reset password with invalid token returns error
  try {
    await axios.post("http://localhost:5000/api/auth/reset-password/invalidtoken999", {
      password: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    });
    console.error("❌ Test 5 Failed: Reset with invalid token should have failed!");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log("✅ Test 5 Passed: Reset with invalid token returned 400 with message:", err.response.data.message);
    } else {
      console.error("❌ Test 5 Error:", err.response?.data || err.message);
    }
  }

  console.log("=== ALL FORGOT PASSWORD E2E TESTS COMPLETED ===");
}

runTest();
