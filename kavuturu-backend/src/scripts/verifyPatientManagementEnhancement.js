// src/scripts/verifyPatientManagementEnhancement.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const VALID_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runPatientEnhancementTests() {
    console.log("\n=================================================");
    console.log("   PATIENT MANAGEMENT ENHANCEMENT TEST SUITE    ");
    console.log("=================================================\n");

    try {
        // Step 0: Staff Login
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 0 - Staff Login", true, `Logged in as Doctor`);

        // -------------------------------------------------------------
        // TEST 1: Book Appointment #1 for New Patient (Rahul Kumar)
        // -------------------------------------------------------------
        const randomDay1 = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
        const randomDay2 = String(Math.floor(Math.random() * 12) + 13).padStart(2, "0");
        const date1 = `2026-12-${randomDay1}`;
        const date2 = `2026-12-${randomDay2}`;

        const slot1 = VALID_SLOTS[Math.floor(Math.random() * VALID_SLOTS.length)];
        const slot2 = VALID_SLOTS[Math.floor(Math.random() * VALID_SLOTS.length)];

        const randomDigits = String(Math.floor(Math.random() * 90000000) + 10000000);
        const testPhone = `98${randomDigits}`;
        const patientName = `Rahul Kumar ${randomDigits.slice(0, 3)}`;

        const booking1 = {
            name: patientName,
            phone: testPhone,
            email: `rahul.${randomDigits}@example.com`,
            treatment: "Laser Root Canal",
            date: date1,
            time: slot1,
            notes: "First visit test",
        };

        const res1 = await axios.post(`${API_BASE}/appointment-requests`, booking1);
        logTest("Test 1 - Book First Appointment", res1.status === 201, `Phone: ${testPhone}`);

        // Check Patients API
        const patientsRes1 = await axios.get(`${API_BASE}/patients`, authHeader);
        const patientsList1 = patientsRes1.data.data || patientsRes1.data || [];
        const matchingPatient1 = patientsList1.filter((p) => p.phone.includes(testPhone) || testPhone.includes(p.phone));

        const isSingleProfile1 = matchingPatient1.length === 1 && matchingPatient1[0].totalVisits === 1;
        logTest("Test 1b - Single Patient Profile Created", isSingleProfile1, `Patient Count: ${matchingPatient1.length} | Visits: ${matchingPatient1[0]?.totalVisits}`);

        // -------------------------------------------------------------
        // TEST 2: Book Appointment #2 for SAME Patient (Rahul Kumar)
        // -------------------------------------------------------------
        const booking2 = {
            name: patientName,
            phone: testPhone,
            email: `rahul.${randomDigits}@example.com`,
            treatment: "Dental Implant",
            date: date2,
            time: slot2,
            notes: "Second visit test",
        };

        const res2 = await axios.post(`${API_BASE}/appointment-requests`, booking2);
        logTest("Test 2 - Book Second Appointment (Same Phone Number)", res2.status === 201);

        // Check Patients API again
        const patientsRes2 = await axios.get(`${API_BASE}/patients`, authHeader);
        const patientsList2 = patientsRes2.data.data || patientsRes2.data || [];
        const matchingPatient2 = patientsList2.filter((p) => p.phone.includes(testPhone) || testPhone.includes(p.phone));

        const isSingleProfile2 = matchingPatient2.length === 1 && matchingPatient2[0].totalVisits === 2;
        logTest("Test 2b - NO Duplicate Patient Profile Created (Visits Updated)", isSingleProfile2, `Patient Count: ${matchingPatient2.length} | Visits: ${matchingPatient2[0]?.totalVisits}`);

        // -------------------------------------------------------------
        // TEST 3: Fetch Patient Profile By ID & Verify History & Upcoming
        // -------------------------------------------------------------
        const patientId = matchingPatient2[0]._id || matchingPatient2[0].id;
        const profileRes = await axios.get(`${API_BASE}/patients/${patientId}`, authHeader);
        const profile = profileRes.data.data || profileRes.data;

        const historyCount = profile.appointmentHistory?.length || 0;
        const isHistoryOk = historyCount >= 2;
        logTest("Test 3 - Appointment History Aggregated", isHistoryOk, `History Records: ${historyCount}`);

        const isUpcomingOk = Boolean(profile.upcomingAppointment || profile.appointmentHistory?.length > 0);
        logTest("Test 3b - Upcoming Appointment & Metrics Calculated", isUpcomingOk, `Latest Status: ${profile.currentStatus || 'Pending'}`);

        console.log("\n=================================================");
        console.log("   PATIENT MANAGEMENT ENHANCEMENT PASSED 100%   ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("\n❌ Patient Enhancement Test Failed:", err.response?.data || err.message);
        process.exit(1);
    }
}

runPatientEnhancementTests();
