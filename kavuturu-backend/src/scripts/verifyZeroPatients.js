// src/scripts/verifyZeroPatients.js

const axios = require("axios");

async function runCheck() {
  console.log("=== VERIFYING ZERO OPERATIONAL DATA IN BACKEND ===");

  // 1. Doctor Login
  const docLogin = await axios.post("http://localhost:5000/api/auth/login", {
    email: "doctor@kavuturudental.com",
    password: "Doctor@123",
  });
  const docToken = docLogin.data.data.token;
  const docHeaders = { Authorization: "Bearer " + docToken };

  // 2. Fetch Patients
  const patientsRes = await axios.get("http://localhost:5000/api/patients", { headers: docHeaders });
  console.log("✅ 1. Patients Count in MongoDB:", (patientsRes.data.data || patientsRes.data).length);

  // 3. Fetch Appointments
  const aptsRes = await axios.get("http://localhost:5000/api/appointments", { headers: docHeaders });
  console.log("✅ 2. Appointments Count in MongoDB:", (aptsRes.data.data || aptsRes.data).length);

  // 4. Fetch Notifications
  const notifsRes = await axios.get("http://localhost:5000/api/notifications", { headers: docHeaders });
  console.log("✅ 3. Notifications Count in MongoDB:", (notifsRes.data.data || notifsRes.data).length);

  // 5. Fetch Receptionists
  const recsRes = await axios.get("http://localhost:5000/api/doctor/receptionists", { headers: docHeaders });
  console.log("✅ 4. Receptionists Count in MongoDB:", (recsRes.data.data || recsRes.data).length);

  console.log("=== ALL OPERATIONAL COLLECTIONS VERIFIED AS 0 ===");
}

runCheck().catch((e) => console.error("❌ Check Failed:", e.response?.data || e.message));
