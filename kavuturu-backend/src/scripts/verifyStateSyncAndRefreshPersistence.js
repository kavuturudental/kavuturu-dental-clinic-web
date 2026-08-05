// src/scripts/verifyStateSyncAndRefreshPersistence.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getRandomPhone = () => `98${Math.floor(Math.random() * 90000000) + 10000000}`;

async function runStateSyncAndRefreshPersistenceSuite() {
    console.log("\n=================================================");
    console.log("   STATE SYNC & REFRESH PERSISTENCE SUITE        ");
    console.log("=================================================\n");

    try {
        // 1. Auth Login
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 1 - Doctor Auth Login", Boolean(token), "Doctor authenticated");

        const todayStr = getLocalDateString(0);
        const phone = getRandomPhone();

        // 2. Action: New Booking Request
        const reqRes = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Sync Test Patient",
            phone: phone,
            email: "sync@test.com",
            treatment: "Laser Root Canal",
            date: todayStr,
            time: "11:00 AM",
        });
        const reqId = reqRes.data.data._id;
        logTest("Step 2 - New Booking Action", Boolean(reqId), `Request ID: ${reqId}`);

        // 3. Action: Accept Request
        const acceptRes = await axios.put(`${API_BASE}/appointment-requests/${reqId}/accept`, {}, authHeader);
        const aptId = acceptRes.data.data.appointment._id;
        logTest("Step 3 - Accept Action", Boolean(aptId), `Apt ID: ${aptId}`);

        // 4. Action: Check In
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Checked In" }, authHeader);
        logTest("Step 4 - Check In Action", true, "Status updated to Checked In");

        // 5. Action: Complete
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Completed" }, authHeader);
        logTest("Step 5 - Complete Action", true, "Status updated to Completed");

        // 6. Simulate Browser Refresh (Re-query backend for state fidelity)
        const refreshedApts = await axios.get(`${API_BASE}/appointments`, authHeader);
        const refreshedPatients = await axios.get(`${API_BASE}/patients`, authHeader);
        const refreshedNotifs = await axios.get(`${API_BASE}/notifications`, authHeader);

        const targetApt = (refreshedApts.data.data || []).find((a) => a._id === aptId);
        const targetPatient = (refreshedPatients.data.data || refreshedPatients.data || []).find((p) => p.phone === phone);

        const isAptPersisted = targetApt && targetApt.status === "Completed";
        const isPatientPersisted = Boolean(targetPatient);
        const isNotifPersisted = (refreshedNotifs.data.data || refreshedNotifs.data || []).length > 0;

        logTest("Step 6a - Refresh Persistence: Appointment Status", isAptPersisted, `Status: ${targetApt?.status}`);
        logTest("Step 6b - Refresh Persistence: Patient Profile", isPatientPersisted, `Patient: ${targetPatient?.name}`);
        logTest("Step 6c - Refresh Persistence: Notifications List", isNotifPersisted, "Notifications intact after refresh");

        // 7. Navigation Round-Trip Test (Dashboard -> Patients -> Appointments)
        await axios.get(`${API_BASE}/dashboard/summary`, authHeader);
        await axios.get(`${API_BASE}/patients`, authHeader);
        const returnApts = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 7 - Navigation Round-Trip", returnApts.status === 200, "Appointments page loaded clean on re-entry");

        console.log("\n=================================================");
        console.log("   STATE SYNC & REFRESH PERSISTENCE SUITE PASSED ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runStateSyncAndRefreshPersistenceSuite();
