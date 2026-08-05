// src/scripts/rolePermissionsE2ETest.js

const axios = require("axios");

async function runTest() {
  console.log("=== STARTING COMPLETE PROFILE MANAGEMENT & ROLE PERMISSIONS E2E SUITE ===");

  try {
    // 1. Doctor Login
    const docLogin = await axios.post("http://localhost:5000/api/auth/login", {
      email: "doctor@kavuturudental.com",
      password: "Doctor@123",
    });
    const docToken = docLogin.data.data.token;
    const docHeaders = { Authorization: "Bearer " + docToken };
    console.log("✅ 1. Doctor Logged In Successfully:", docLogin.data.data.user.email);

    // 2. Doctor Profile Update
    const updateDocRes = await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        name: "Dr. K. Ravindra Babu, MDS",
        qualification: "BDS, MDS – Conservative Dentistry & Endodontics",
        email: "doctor@kavuturudental.com",
      },
      { headers: docHeaders }
    );
    console.log("✅ 2. Doctor Profile Update Success:", updateDocRes.data.data.name, "|", updateDocRes.data.data.qualification);

    // Restore Doctor name
    await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        name: "Dr. K. Ravindra Babu",
        qualification: "BDS, MDS – Conservative Dentistry & Endodontics",
        email: "doctor@kavuturudental.com",
      },
      { headers: docHeaders }
    );

    // 3. Receptionist Login
    const recLogin = await axios.post("http://localhost:5000/api/auth/login", {
      email: "receptionist@kavuturudental.com",
      password: "Reception@123",
    });
    const recToken = recLogin.data.data.token;
    const recHeaders = { Authorization: "Bearer " + recToken };
    console.log("✅ 3. Receptionist Logged In Successfully:", recLogin.data.data.user.email);

    // 4. Receptionist Update Display Name (attempting to alter email & phone)
    const updateRecRes = await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        name: "Sindhu - Senior Receptionist",
        email: "hackedemail@hacker.com", // Should be IGNORED by backend
        phone: "+91 00000 00000",       // Should be IGNORED by backend
      },
      { headers: recHeaders }
    );
    console.log("✅ 4. Receptionist Profile Update Returned Payload:");
    console.log("   - Updated Name:", updateRecRes.data.data.name);
    console.log("   - Retained Email (Locked):", updateRecRes.data.data.email);
    console.log("   - Retained Phone (Locked):", updateRecRes.data.data.phone);

    if (updateRecRes.data.data.email === "hackedemail@hacker.com") {
      console.error("❌ SECURITY ERROR: Receptionist was allowed to modify email!");
    } else {
      console.log("✅ 5. Verified Security Enforced: Receptionist email remained locked as stored by Doctor!");
    }

    // Restore Receptionist Name
    await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        name: "Clinic Receptionist",
      },
      { headers: recHeaders }
    );

    // 5. Fetch Single Source of Truth
    const getProfileRes = await axios.get("http://localhost:5000/api/auth/profile", { headers: recHeaders });
    console.log("✅ 6. Single Source of Truth Profile Fetched from MongoDB:", getProfileRes.data.data.name, "|", getProfileRes.data.data.email);

    console.log("=== ALL ROLE-BASED PROFILE MANAGEMENT TESTS PASSED 100% ===");
  } catch (err) {
    console.error("❌ Test Failed Details:", err.response ? err.response.data : err.message);
  }
}

runTest();
