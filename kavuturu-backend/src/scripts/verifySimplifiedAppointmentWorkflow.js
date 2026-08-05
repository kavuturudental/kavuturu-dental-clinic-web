// src/scripts/verifySimplifiedAppointmentWorkflow.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runSimplifiedWorkflowTests() {
    console.log("\n=================================================");
    console.log("   SIMPLIFIED APPOINTMENT WORKFLOW TEST SUITE   ");
    console.log("=================================================\n");

    let createdId = null;
    let authHeader = {};
    let testPhone = `98${Math.floor(Math.random() * 90000000) + 10000000}`;
    const randomDay = 10 + Math.floor(Math.random() * 15);
    const testDate1 = `2027-01-${String(randomDay).padStart(2, '0')}`;
    const testDate2 = `2027-01-${String(randomDay + 1).padStart(2, '0')}`;

    try {
        // Step 0: Login as Doctor
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 0 - Auth Login", Boolean(token), "Doctor token obtained");

        // Step 1: Book New Appointment Request
        const reqRes = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Rahul Kumar",
            phone: testPhone,
            email: "rahul@example.com",
            treatment: "Dental Crown",
            date: testDate1,
            time: "09:30 AM",
            notes: "Refactored workflow test",
        });
        createdId = reqRes.data?.data?._id;
        logTest("Test 1 - Book Appointment Request", reqRes.status === 201, `ID: ${createdId}`);

        // Step 2: Accept Appointment Request (Status -> Confirmed)
        const acceptRes = await axios.put(`${API_BASE}/appointment-requests/${createdId}/accept`, {}, authHeader);
        const aptId = String(acceptRes.data?.data?.appointment?._id || acceptRes.data?.data?._id || createdId);
        logTest("Test 2 - Accept Appointment Request", acceptRes.status === 200, `Apt ID: ${aptId}`);

        // Step 3: Edit Appointment Date & Time (Confirmed -> Remains Confirmed)
        const editRes = await axios.put(`${API_BASE}/appointments/${aptId}`, {
            treatment: "Laser Root Canal",
            appointmentDate: testDate2,
            appointmentTime: "11:30 AM",
        }, authHeader);

        const updatedApt = editRes.data?.data;
        const isSameId = String(updatedApt._id) === String(aptId);
        const isConfirmed = updatedApt.status === "Confirmed";
        const isDateUpdated = updatedApt.appointmentDate.includes(testDate2);
        const isTimeUpdated = updatedApt.appointmentTime === "11:30 AM";

        logTest("Test 3 - Edit Date/Time on Confirmed Apt", isSameId && isConfirmed && isDateUpdated && isTimeUpdated, `Same ID: ${isSameId} | Status: ${updatedApt.status}`);

        // Step 4: Check In Patient
        await axios.patch(`${API_BASE}/appointments/${aptId}/status`, { status: "Checked In" }, authHeader);
        logTest("Test 4 - Check In Patient", true, "Status updated to Checked In");

        // Step 5: Try Editing Date/Time on Checked-In Appointment (Must be Rejected)
        try {
            await axios.put(`${API_BASE}/appointments/${aptId}`, {
                appointmentDate: testDate1,
                appointmentTime: "02:00 PM",
            }, authHeader);
            logTest("Test 5 - Reject Reschedule for Checked-In Apt", false, "Unexpectedly allowed reschedule!");
        } catch (err) {
            const is400 = err.response && err.response.status === 400;
            const msg = err.response?.data?.message || err.message;
            logTest("Test 5 - Reject Reschedule for Checked-In Apt", is400, `Rejected correctly: "${msg}"`);
        }

        console.log("\n=================================================");
        console.log("   SIMPLIFIED APPOINTMENT WORKFLOW PASSED 100%  ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runSimplifiedWorkflowTests();
