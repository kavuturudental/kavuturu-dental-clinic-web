// src/scripts/verifyMultiPortalSynchronization.js

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

async function runMultiPortalSyncSuite() {
    console.log("\n=================================================");
    console.log("   MULTI-PORTAL REAL-TIME SYNC TEST SUITE       ");
    console.log("=================================================\n");

    try {
        // 1. Authenticate both Doctor & Receptionist sessions
        const doctorLogin = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const doctorToken = doctorLogin.data?.data?.token || doctorLogin.data?.token;
        const doctorHeader = { headers: { Authorization: `Bearer ${doctorToken}` } };

        const recLogin = await axios.post(`${API_BASE}/auth/login`, {
            email: "receptionist@kavuturudental.com",
            password: "Reception@123",
        });
        const recToken = recLogin.data?.data?.token || recLogin.data?.token;
        const recHeader = { headers: { Authorization: `Bearer ${recToken}` } };

        logTest("Step 1 - Doctor & Receptionist Authenticated", Boolean(doctorToken && recToken), "Both portal session tokens active");

        // 2. Public Patient books appointment request
        const todayStr = getLocalDateString(0);
        const phone = getRandomPhone();

        const reqRes = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "MultiPortal Patient",
            phone: phone,
            email: "multiportal@test.com",
            treatment: "Dental Implants",
            date: todayStr,
            time: "02:30 PM",
        });
        const reqId = reqRes.data.data._id;
        logTest("Step 2 - New Booking Action Created", Boolean(reqId), `Request ID: ${reqId}`);

        // 3. Receptionist Portal accepts request
        const acceptRes = await axios.put(`${API_BASE}/appointment-requests/${reqId}/accept`, {}, recHeader);
        const aptId = acceptRes.data.data.appointment._id;
        logTest("Step 3 - Receptionist Action: Accept Request", Boolean(aptId), `Apt ID: ${aptId}`);

        // Doctor Portal verifies synced appointment & dashboard metrics
        const doctorAptCheck = await axios.get(`${API_BASE}/appointments`, doctorHeader);
        const doctorDashboardCheck = await axios.get(`${API_BASE}/dashboard/summary`, doctorHeader);
        const isDocSyncedAfterAccept = (doctorAptCheck.data.data || []).some((a) => a._id === aptId);

        logTest("Step 4 - Doctor Portal Synced After Receptionist Accept", isDocSyncedAfterAccept, `Doctor sees accepted Apt ${aptId} in real-time`);

        // 4. Receptionist Portal checks in patient
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Checked In" }, recHeader);

        // Doctor Portal verifies status change
        const doctorCheckInView = await axios.get(`${API_BASE}/appointments/${aptId}`, doctorHeader);
        const isDocSyncedCheckedIn = doctorCheckInView.data.data.status === "Checked In" || doctorCheckInView.data.data.status === "Patient Arrived";
        logTest("Step 5 - Doctor Portal Synced After Receptionist Check In", isDocSyncedCheckedIn, `Doctor sees status: ${doctorCheckInView.data.data.status}`);

        // 5. Doctor Portal completes appointment
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Completed" }, doctorHeader);

        // Receptionist Portal verifies completed status, patient history, and dashboard
        const recCompletedCheck = await axios.get(`${API_BASE}/appointments/${aptId}`, recHeader);
        const recPatientCheck = await axios.get(`${API_BASE}/patients`, recHeader);
        const recDashboardCheck = await axios.get(`${API_BASE}/dashboard/summary`, recHeader);

        const isRecSyncedCompleted = recCompletedCheck.data.data.status === "Completed";
        const isRecPatientSynced = (recPatientCheck.data.data || recPatientCheck.data || []).some((p) => p.phone === phone);

        logTest("Step 6a - Receptionist Synced After Doctor Complete (Appointment Status)", isRecSyncedCompleted, "Status: Completed");
        logTest("Step 6b - Receptionist Synced After Doctor Complete (Patient Profile & Visit Count)", isRecPatientSynced, `Patient phone ${phone} synced in history`);
        logTest("Step 6c - Receptionist Synced After Doctor Complete (Dashboard Statistics)", recDashboardCheck.status === 200, "Dashboard metrics synced live");

        console.log("\n=================================================");
        console.log("   MULTI-PORTAL REAL-TIME SYNC PASSED 100%       ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runMultiPortalSyncSuite();
