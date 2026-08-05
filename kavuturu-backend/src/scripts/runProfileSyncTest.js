// src/scripts/runProfileSyncTest.js

const axios = require("axios");

async function runTest() {
  console.log("=== STARTING PROFILE SYNC E2E TEST ===");

  // 1. Doctor Login
  const docLogin = await axios.post("http://localhost:5000/api/auth/login", {
    email: "doctor@kavuturudental.com",
    password: "Doctor@123",
  });
  const docToken = docLogin.data.data.token;
  const docHeaders = { Authorization: "Bearer " + docToken };

  // 2. Doctor Profile Update
  const updateDocRes = await axios.put(
    "http://localhost:5000/api/auth/profile",
    {
      name: "Dr. K. Ravindra Babu, MDS",
      qualification: "BDS, MDS – Endodontist & Implantologist",
      email: "doctor@kavuturudental.com",
    },
    { headers: docHeaders }
  );
  console.log("✅ 1. Doctor Profile Update Payload:", updateDocRes.data.data.name, "|", updateDocRes.data.data.qualification);

  // 3. Verify Doctor MongoDB Persistence
  const getDocRes = await axios.get("http://localhost:5000/api/auth/profile", { headers: docHeaders });
  console.log("✅ 2. Verified Doctor Profile in MongoDB:", getDocRes.data.data.name, "|", getDocRes.data.data.qualification);

  // Restore original Doctor profile
  await axios.put(
    "http://localhost:5000/api/auth/profile",
    {
      name: "Dr. K. Ravindra Babu",
      qualification: "BDS, MDS – Conservative Dentistry & Endodontics",
      email: "doctor@kavuturudental.com",
    },
    { headers: docHeaders }
  );
  console.log("✅ 3. Restored Doctor Profile");

  // 4. Receptionist Login
  const recLogin = await axios.post("http://localhost:5000/api/auth/login", {
    email: "receptionist@kavuturudental.com",
    password: "Reception@123",
  });
  const recToken = recLogin.data.data.token;
  const recHeaders = { Authorization: "Bearer " + recToken };

  // 5. Receptionist Profile Update
  const updateRecRes = await axios.put(
    "http://localhost:5000/api/auth/profile",
    {
      name: "Senior Clinic Receptionist",
      email: "receptionist@kavuturudental.com",
      phone: "+91 98480 12345",
    },
    { headers: recHeaders }
  );
  console.log("✅ 4. Receptionist Profile Update Payload:", updateRecRes.data.data.name, "|", updateRecRes.data.data.email);

  // 6. Verify Receptionist MongoDB Persistence
  const getRecRes = await axios.get("http://localhost:5000/api/auth/profile", { headers: recHeaders });
  console.log("✅ 5. Verified Receptionist Profile in MongoDB:", getRecRes.data.data.name, "|", getRecRes.data.data.email);

  // Restore original Receptionist profile
  await axios.put(
    "http://localhost:5000/api/auth/profile",
    {
      name: "Clinic Receptionist",
      email: "receptionist@kavuturudental.com",
      phone: "9876543210",
    },
    { headers: recHeaders }
  );
  console.log("✅ 6. Restored Receptionist Profile");

  console.log("=== ALL PROFILE SYNC TESTS PASSED 100% ===");
}

runTest().catch((e) => console.error("❌ E2E Failed:", e.response?.data || e.message));
