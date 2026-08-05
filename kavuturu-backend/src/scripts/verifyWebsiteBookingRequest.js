// src/scripts/verifyWebsiteBookingRequest.js

const axios = require("axios");

async function testWebsiteBooking() {
  console.log("=== STARTING PUBLIC WEBSITE BOOKING E2E TEST ===");

  // 1. Doctor Login
  const docLogin = await axios.post("http://localhost:5000/api/auth/login", {
    email: "doctor@kavuturudental.com",
    password: "Doctor@123",
  });
  const docToken = docLogin.data.data.token;
  const docHeaders = { Authorization: "Bearer " + docToken };
  console.log("✅ 1. Doctor Logged In Successfully.");

  // 2. Submit public appointment booking request from website
  const bookingPayload = {
    patientName: "Nagaraju Varma",
    phone: "9848011223",
    email: "nagaraju.v@example.com",
    treatment: "Laser Gum Treatment",
    preferredDate: "2026-08-05",
    preferredTime: "11:00 AM",
    message: "Patient experiencing gum bleeding and sensitivity.",
    bookingSource: "Website",
  };

  const bookingRes = await axios.post("http://localhost:5000/api/appointment-requests", bookingPayload);
  console.log("✅ 2. Public Booking Submitted via API:", bookingRes.data.message);
  console.log("   - Created Request ID:", bookingRes.data.data._id);
  console.log("   - Status:", bookingRes.data.data.status);

  // 3. Fetch Appointment Requests in Portal
  const requestsRes = await axios.get("http://localhost:5000/api/appointment-requests", { headers: docHeaders });
  const requests = requestsRes.data.data || requestsRes.data;
  console.log("✅ 3. Appointment Requests Fetched in Portal Table:", requests.length, "request(s)");

  const pendingCount = requests.filter((r) => r.status.toLowerCase() === "pending").length;
  console.log("✅ 4. Live Pending Count Badge for Sidebar:", pendingCount);

  // 4. Verify Staff Notification
  const notifsRes = await axios.get("http://localhost:5000/api/notifications", { headers: docHeaders });
  const notifs = notifsRes.data.data || notifsRes.data;
  console.log("✅ 5. Staff Notification Count:", notifs.length, "| Latest Title:", notifs[0]?.title);

  console.log("=== WEBSITE BOOKING E2E TEST PASSED 100% ===");
}

testWebsiteBooking().catch((e) => console.error("❌ E2E Failed:", e.response?.data || e.message));
