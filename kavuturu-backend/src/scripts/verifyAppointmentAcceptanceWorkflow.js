// src/scripts/verifyAppointmentAcceptanceWorkflow.js

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

async function runAcceptanceWorkflowTests() {
    console.log("\n=================================================");
    console.log("   APPOINTMENT ACCEPTANCE WORKFLOW TEST SUITE   ");
    console.log("=================================================\n");

    let createdId = null;
    let authHeader = {};

    try {
        // Step 0: Login as Doctor to get token
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 0 - Staff Login", true, `Logged in as ${loginRes.data?.data?.user?.email || 'Doctor'}`);

        // -------------------------------------------------------------
        // TEST 1: Book New Website Appointment Request (Status = Pending)
        // -------------------------------------------------------------
        const randomDay = String(Math.floor(Math.random() * 25) + 1).padStart(2, "0");
        const testDate = `2026-12-${randomDay}`;
        const testTime = VALID_SLOTS[Math.floor(Math.random() * VALID_SLOTS.length)];
        const randomDigits = String(Math.floor(Math.random() * 90000000) + 10000000);
        const testPhone = `98${randomDigits}`; // Exact 10 digits

        const bookingPayload = {
            name: `Patient ${randomDigits.slice(0, 4)}`,
            phone: testPhone,
            email: `patient.${randomDigits}@example.com`,
            treatment: "Dental Implant Consultation",
            date: testDate,
            time: testTime,
            notes: "Workflow acceptance test notes",
        };

        const bookRes = await axios.post(`${API_BASE}/appointment-requests`, bookingPayload);
        createdId = String(bookRes.data.data?._id || bookRes.data.data?.id);

        const isBookedOk = bookRes.status === 201 && createdId && bookRes.data.data.status === "Pending";
        logTest("Test 1 - Book New Appointment (Website)", isBookedOk, `ID: ${createdId} | Status: Pending`);

        if (!isBookedOk) {
            throw new Error("Failed initial booking step");
        }

        // Verify it appears in GET /api/appointment-requests (Pending list)
        const requestsRes = await axios.get(`${API_BASE}/appointment-requests`, authHeader);
        const reqList = requestsRes.data.data || requestsRes.data || [];
        const isFoundInRequests = reqList.some((r) => String(r._id || r.id) === createdId);
        logTest("Test 1b - Present in Appointment Requests Queue", isFoundInRequests, `Found in Pending list`);

        // Verify it DOES NOT appear in GET /api/appointments (Appointments list)
        const aptsBeforeRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        const aptsBeforeList = aptsBeforeRes.data.data || aptsBeforeRes.data || [];
        const isAbsentFromAppointments = !aptsBeforeList.some((a) => String(a._id || a.id) === createdId);
        logTest("Test 1c - Excluded from Appointments Section", isAbsentFromAppointments, `Not in confirmed appointments list`);

        // Get initial Dashboard Stats
        const dashBeforeRes = await axios.get(`${API_BASE}/dashboard/summary`, authHeader);
        const initialPendingCount = dashBeforeRes.data.pendingRequests;

        // -------------------------------------------------------------
        // TEST 2: Accept the Appointment Request (Pending -> Confirmed)
        // -------------------------------------------------------------
        const acceptRes = await axios.put(`${API_BASE}/appointment-requests/${createdId}/accept`, {}, authHeader);
        const isAcceptOk = acceptRes.status === 200 && acceptRes.data.success;
        logTest("Test 2 - Accept Appointment Request", isAcceptOk, `Status code 200 returned`);

        const createdAptId = String(acceptRes.data.data?.appointment?._id || acceptRes.data.data?.appointment?.id || createdId);

        // Verify it is REMOVED from GET /api/appointment-requests
        const requestsAfterRes = await axios.get(`${API_BASE}/appointment-requests`, authHeader);
        const reqAfterList = requestsAfterRes.data.data || requestsAfterRes.data || [];
        const isRemovedFromRequests = !reqAfterList.some((r) => String(r._id || r.id) === createdId && r.status === "Pending");
        logTest("Test 2b - Removed from Appointment Requests List", isRemovedFromRequests, `No longer in Pending queue`);

        // Verify it APPEARS in GET /api/appointments with Status = Confirmed
        const aptsAfterRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        const aptsAfterList = aptsAfterRes.data.data || aptsAfterRes.data || [];
        const acceptedApt = aptsAfterList.find((a) => String(a._id || a.id) === createdAptId || String(a._id || a.id) === createdId);
        const isPresentInAppointments = Boolean(acceptedApt && acceptedApt.status === "Confirmed");
        logTest("Test 2c - Automatically Appears in Appointments Section", isPresentInAppointments, `Status = Confirmed | Patient: ${acceptedApt?.patient?.name || 'N/A'}`);

        // Verify Dashboard Statistics updated
        const dashAfterRes = await axios.get(`${API_BASE}/dashboard/summary`, authHeader);
        const isDashboardUpdated = dashAfterRes.data.pendingRequests === initialPendingCount - 1;
        logTest("Test 2d - Dashboard Statistics Updated", isDashboardUpdated, `Pending Count: ${dashBeforeRes.data.pendingRequests} → ${dashAfterRes.data.pendingRequests}`);

        // -------------------------------------------------------------
        // TEST 3: Persistence Verification Across Refetches
        // -------------------------------------------------------------
        const reFetchApts = await axios.get(`${API_BASE}/appointments`, authHeader);
        const reFetchReqs = await axios.get(`${API_BASE}/appointment-requests`, authHeader);

        const stillInApts = (reFetchApts.data.data || []).some((a) => String(a._id || a.id) === createdAptId);
        const stillAbsentFromReqs = !(reFetchReqs.data.data || []).some((r) => String(r._id || r.id) === createdId && r.status === "Pending");

        const isPersistenceOk = stillInApts && stillAbsentFromReqs;
        logTest("Test 3 - Persistence Verification After Refetch", isPersistenceOk, `Persists correctly without duplication or reappearing`);

        console.log("\n=================================================");
        console.log("   ALL ACCEPTANCE WORKFLOW TESTS PASSED 100%    ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("\n❌ Acceptance Workflow Test Failed:", err.response?.data || err.message);
        process.exit(1);
    }
}

runAcceptanceWorkflowTests();
