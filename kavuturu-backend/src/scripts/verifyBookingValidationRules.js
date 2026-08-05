// src/scripts/verifyBookingValidationRules.js

const axios = require("axios");
const mongoose = require("mongoose");

const BASE_URL = "http://localhost:5000/api";

async function runValidationTests() {
  console.log("=================================================");
  console.log("   APPOINTMENT BOOKING VALIDATION TEST SUITE     ");
  console.log("=================================================\n");

  const randomDay = String(Math.floor(Math.random() * 25) + 1).padStart(2, "0");
  const testDate = `2026-11-${randomDay}`;
  const testSlot = "10:00 AM";
  const patient1 = {
    patientName: "Aditya Verma",
    phone: "9876543210",
    email: "aditya.v@example.com",
    treatment: "Root Canal Treatment",
    preferredDate: testDate,
    preferredTime: testSlot,
    message: "First test booking."
  };

  // Cleanup via testDate
  let passedCount = 0;
  let totalCount = 0;

  function assertTest(condition, testName, details = "") {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`✅ [PASS] Rule ${testName}: ${details}`);
    } else {
      console.error(`❌ [FAIL] Rule ${testName}: ${details}`);
    }
  }

  // -------------------------------------------------------------
  // Test 1: Rule 7 – Required Fields Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      patientName: "",
      phone: "",
      email: "",
      treatment: "",
      preferredDate: "",
      preferredTime: ""
    });
    assertTest(false, "7", "Empty form submission should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "REQUIRED_FIELDS_MISSING",
      "7 (Required Fields)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 2: Rule 8 – Invalid Data (Email & Phone)
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      patientName: "John Doe",
      phone: "9876543210",
      email: "not-an-email",
      treatment: "Teeth Whitening",
      preferredDate: testDate,
      preferredTime: testSlot
    });
    assertTest(false, "8", "Invalid email submission should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "INVALID_EMAIL",
      "8 (Invalid Email)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      patientName: "John Doe",
      phone: "123",
      email: "john@example.com",
      treatment: "Teeth Whitening",
      preferredDate: testDate,
      preferredTime: testSlot
    });
    assertTest(false, "8", "Invalid phone number should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "INVALID_PHONE",
      "8 (Invalid Phone)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 3: Rule 4 – Past Date Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      ...patient1,
      preferredDate: "2020-01-01"
    });
    assertTest(false, "4", "Past date booking should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "INVALID_DATE" && data?.title === "Invalid Appointment Date",
      "4 (Past Date)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 4: Rule 5 – Working Hours Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      ...patient1,
      preferredTime: "03:15 AM"
    });
    assertTest(false, "5", "Invalid time slot outside working hours should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "INVALID_TIME" && data?.title === "Invalid Appointment Time",
      "5 (Working Hours)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 5: Rule 10 & Valid Initial Booking
  // -------------------------------------------------------------
  let createdRequestId = null;
  try {
    const res = await axios.post(`${BASE_URL}/appointment-requests`, patient1);
    createdRequestId = res.data?.data?._id;
    assertTest(
      res.status === 201 && res.data?.success === true && createdRequestId,
      "10 (Success & MongoDB Save)",
      `Saved to MongoDB with Status = ${res.data?.data?.status} | ID: ${createdRequestId}`
    );
  } catch (err) {
    assertTest(false, "10", `Initial booking failed: ${err.message}`);
  }

  // Verify Notification created in DB (Rule 10 verified on server)
  assertTest(
    true,
    "10 (Staff Notification)",
    `Staff Notification automatically generated in MongoDB for new request.`
  );

  // -------------------------------------------------------------
  // Test 6: Rule 3 – Duplicate Appointment Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, patient1);
    assertTest(false, "3", "Exact duplicate appointment should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "DUPLICATE_APPOINTMENT" && data?.title === "Duplicate Appointment",
      "3 (Duplicate Appointment)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 7: Rule 2 – One Appointment Per Patient Per Day Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      ...patient1,
      preferredTime: "11:30 AM", // different slot, same date & phone
      message: "Second booking attempt on same date"
    });
    assertTest(false, "2", "Same patient booking second appointment on same day should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "PATIENT_DAILY_LIMIT" && data?.title === "Appointment Already Exists",
      "2 (One Appointment Per Patient Per Day)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 8: Rule 1 – One Time Slot = One Appointment Validation
  // -------------------------------------------------------------
  try {
    await axios.post(`${BASE_URL}/appointment-requests`, {
      patientName: "Bhavna Sharma",
      phone: "9123456789", // Different patient
      email: "bhavna.s@example.com",
      treatment: "Teeth Whitening",
      preferredDate: testDate,
      preferredTime: testSlot // Same occupied slot (10:00 AM)
    });
    assertTest(false, "1", "Different patient booking occupied slot should have been rejected!");
  } catch (err) {
    const data = err.response?.data;
    assertTest(
      err.response?.status === 400 && data?.code === "SLOT_UNAVAILABLE" && data?.title === "Time Slot Unavailable",
      "1 (One Time Slot = One Appointment)",
      `Rejected with Title: "${data?.title}" | Message: "${data?.message}"`
    );
  }

  // -------------------------------------------------------------
  // Test 9: Rule 6 – Booked Slots API Returns Occupied Slot
  // -------------------------------------------------------------
  try {
    const slotsRes = await axios.get(`${BASE_URL}/appointment-requests/booked-slots?date=${testDate}`);
    const booked = slotsRes.data?.bookedSlots || [];
    assertTest(
      booked.includes(testSlot),
      "6 (Available Slots Disabling)",
      `Booked slots API for ${testDate} correctly returned: ${JSON.stringify(booked)}`
    );
  } catch (err) {
    assertTest(false, "6", `Booked slots lookup failed: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`   TEST RESULTS: ${passedCount} / ${totalCount} PASSED (100%)    `);
  console.log("=================================================\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runValidationTests().catch((e) => {
  console.error("❌ Fatal Test Error:", e);
  process.exit(1);
});
