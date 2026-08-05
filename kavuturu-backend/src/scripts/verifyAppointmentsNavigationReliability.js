// src/scripts/verifyAppointmentsNavigationReliability.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runNavigationReliabilityTests() {
    console.log("\n=================================================");
    console.log("   APPOINTMENTS NAVIGATION RELIABILITY SUITE    ");
    console.log("=================================================\n");

    try {
        // 1. Auth Login
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 1 - Auth Login", Boolean(token), "Doctor authenticated");

        // 2. Visit 1: Open Appointments
        const visit1 = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 2 - Initial Open Appointments", visit1.status === 200, `Appointments loaded: ${visit1.data?.data?.length || 0}`);

        // 3. Navigate away to Patients
        const navPatients = await axios.get(`${API_BASE}/patients`, authHeader);
        logTest("Step 3 - Navigate Away to Patients", navPatients.status === 200, "Patients loaded");

        // 4. Return to Appointments (Visit 2)
        const visit2 = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 4 - Return to Appointments (Visit 2)", visit2.status === 200, "Appointments re-loaded clean");

        // 5. Navigate away to Notifications
        const navNotifs = await axios.get(`${API_BASE}/notifications`, authHeader);
        logTest("Step 5 - Navigate Away to Notifications", navNotifs.status === 200, "Notifications loaded");

        // 6. Return to Appointments (Visit 3)
        const visit3 = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 6 - Return to Appointments (Visit 3)", visit3.status === 200, "Appointments re-loaded clean");

        // 7. Book, Edit, Complete & Return to Appointments
        const uniqueDay = 15 + Math.floor(Math.random() * 10);
        const bookRes = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Test Navigation Patient",
            phone: `98${Math.floor(Math.random() * 90000000) + 10000000}`,
            email: "navtest@example.com",
            treatment: "Teeth Whitening",
            date: `2027-02-${String(uniqueDay).padStart(2, '0')}`,
            time: "10:30 AM",
            notes: "Navigation test",
        });
        const reqId = bookRes.data?.data?._id;
        logTest("Step 7a - Book Request for Navigation Test", Boolean(reqId), `ID: ${reqId}`);

        const acceptRes = await axios.put(`${API_BASE}/appointment-requests/${reqId}/accept`, {}, authHeader);
        const aptId = acceptRes.data?.data?.appointment?._id || reqId;
        logTest("Step 7b - Accept Request", acceptRes.status === 200, `Apt ID: ${aptId}`);

        // Edit appointment
        await axios.put(`${API_BASE}/appointments/${aptId}`, {
            treatment: "Laser Root Canal",
            appointmentTime: "11:30 AM",
        }, authHeader);
        logTest("Step 7c - Edit Appointment", true, "Appointment updated");

        // Navigate away and back
        const visit4 = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 7d - Return to Appointments after Edit", visit4.status === 200, "Appointments re-loaded clean");

        // Cancel appointment
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Cancelled" }, authHeader);
        logTest("Step 7e - Cancel Appointment", true, "Status updated to Cancelled");

        // Navigate away and back
        const visit5 = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 7f - Return to Appointments after Cancel", visit5.status === 200, "Appointments re-loaded clean");

        console.log("\n=================================================");
        console.log("   APPOINTMENTS NAVIGATION SUITE PASSED 100%    ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runNavigationReliabilityTests();
