// src/scripts/testForgot.js

const axios = require("axios");

async function testForgot() {
  console.log("=== FORGOT PASSWORD E2E TEST ===");

  // 1. Non-existent email check
  try {
    const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "notfound@kavuturu.com",
    });
    console.log("1. Unexpected success:", res.data);
  } catch (err) {
    console.log("1. Non-existent email error:", err.response ? err.response.data : err.message);
  }

  // 2. Doctor email request
  try {
    const docRes = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "doctor@kavuturudental.com",
    });
    console.log("2. Doctor reset link request success:", docRes.data);
  } catch (err) {
    console.log("2. Doctor request error:", err.response ? err.response.data : err.message);
  }

  // 3. Receptionist email request
  try {
    const recRes = await axios.post("http://localhost:5000/api/auth/forgot-password", {
      email: "receptionist@kavuturudental.com",
    });
    console.log("3. Receptionist reset link request success:", recRes.data);
  } catch (err) {
    console.log("3. Receptionist request error:", err.response ? err.response.data : err.message);
  }

  // 4. Invalid token verification
  try {
    const verRes = await axios.get("http://localhost:5000/api/auth/verify-reset-token/invalidtoken123");
    console.log("4. Unexpected token valid:", verRes.data);
  } catch (err) {
    console.log("4. Invalid token verification error:", err.response ? err.response.data : err.message);
  }

  // 5. Invalid token password reset
  try {
    const resetRes = await axios.post("http://localhost:5000/api/auth/reset-password/invalidtoken123", {
      password: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    });
    console.log("5. Unexpected reset success:", resetRes.data);
  } catch (err) {
    console.log("5. Invalid token reset error:", err.response ? err.response.data : err.message);
  }

  console.log("=== E2E TEST COMPLETE ===");
}

testForgot();
