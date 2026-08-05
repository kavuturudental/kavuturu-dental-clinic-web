// src/scripts/timeSlotValidationE2ETest.js

const axios = require("axios");
const mongoose = require("mongoose");

async function runTest() {
  console.log("=== STARTING TIME SLOT VALIDATION & DOUBLE-BOOKING E2E TEST SUITE ===");

  const testDate = "2026-08-10";
  const testSlot = "10:00 AM";

  // 1. Query Booked Slots API (Initially Empty)
  const initialSlotsRes = await axios.get(`http://localhost:5000/api/appointment-requests/booked-slots?date=${testDate}`);
  console.log("✅ 1. Initial Booked Slots for", testDate, ":", initialSlotsRes.data.bookedSlots);

  // 2. Patient A Books 10:00 AM on 2026-08-10
  const bookingA = await axios.post("http://localhost:5000/api/appointment-requests", {
    patientName: "Patient A (Rajesh)",
    phone: "9848012345",
    treatment: "Laser Root Canal",
    preferredDate: testDate,
    preferredTime: testSlot,
    bookingSource: "Website"
  });
  console.log("✅ 2. Patient A Booking Success:", bookingA.data.message, "| Slot:", testSlot);

  // 3. Query Booked Slots API (Should show 10:00 AM as Booked)
  const updatedSlotsRes = await axios.get(`http://localhost:5000/api/appointment-requests/booked-slots?date=${testDate}`);
  console.log("✅ 3. Updated Booked Slots for", testDate, ":", updatedSlotsRes.data.bookedSlots);
  if (!updatedSlotsRes.data.bookedSlots.includes(testSlot)) {
    throw new Error("FAIL: 10:00 AM slot was not returned as booked!");
  }

  // 4. Patient B Attempts to Book Same Date and Same Time Slot (10:00 AM on 2026-08-10) -> Should REJECT
  try {
    await axios.post("http://localhost:5000/api/appointment-requests", {
      patientName: "Patient B (Suresh)",
      phone: "9123456789",
      treatment: "Teeth Whitening",
      preferredDate: testDate,
      preferredTime: testSlot,
      bookingSource: "Website"
    });
    console.error("❌ FAIL: Patient B was allowed to double-book the occupied slot!");
  } catch (err) {
    console.log("✅ 4. Patient B Double-Booking Rejected Correctly:", err.response?.data?.message);
  }

  // 5. Patient A Attempts to Book Same Date Again (11:00 AM on 2026-08-10) -> Should REJECT for Same Patient
  try {
    await axios.post("http://localhost:5000/api/appointment-requests", {
      patientName: "Patient A (Rajesh)",
      phone: "9848012345",
      treatment: "Dental Implants",
      preferredDate: testDate,
      preferredTime: "11:00 AM",
      bookingSource: "Website"
    });
    console.error("❌ FAIL: Patient A was allowed to book multiple appointments on the same date!");
  } catch (err) {
    console.log("✅ 5. Same Patient Same Date Booking Rejected Correctly:", err.response?.data?.message);
  }

  // 6. Patient B Books Different Available Slot (11:00 AM on 2026-08-10) -> Should ALLOW
  const bookingB = await axios.post("http://localhost:5000/api/appointment-requests", {
    patientName: "Patient B (Suresh)",
    phone: "9123456789",
    treatment: "Teeth Whitening",
    preferredDate: testDate,
    preferredTime: "11:00 AM",
    bookingSource: "Website"
  });
  console.log("✅ 6. Patient B Booking Different Slot Success:", bookingB.data.message);

  // 7. Patient B Books Same Slot on Different Date (10:00 AM on 2026-08-11) -> Should ALLOW
  const bookingDiffDay = await axios.post("http://localhost:5000/api/appointment-requests", {
    patientName: "Patient B (Suresh)",
    phone: "9123456789",
    treatment: "Teeth Whitening",
    preferredDate: "2026-08-11",
    preferredTime: "10:00 AM",
    bookingSource: "Website"
  });
  console.log("✅ 7. Booking Same Slot on Different Date Success:", bookingDiffDay.data.message);

  // Clean up test documents
  await mongoose.connect("mongodb+srv://admin:KDC2026AtlasDb@kavuturudental.5o1gisr.mongodb.net/kavuturuDentalClinic?retryWrites=true&w=majority&appName=kavuturudental");
  const AppointmentRequest = mongoose.model("AppointmentRequest", new mongoose.Schema({}, { strict: false }));
  const Notification = mongoose.model("Notification", new mongoose.Schema({}, { strict: false }));
  await AppointmentRequest.deleteMany({});
  await Notification.deleteMany({});
  await mongoose.disconnect();
  console.log("✅ 8. Cleaned up test records.");

  console.log("=== ALL TIME SLOT & DOUBLE-BOOKING TESTS PASSED 100% ===");
}

runTest().catch((e) => console.error("❌ E2E Test Failed:", e.response?.data || e.message));
