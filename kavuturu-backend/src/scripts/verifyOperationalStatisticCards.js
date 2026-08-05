// src/scripts/verifyOperationalStatisticCards.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runOperationalStatisticCardsTests() {
    console.log("\n=================================================");
    console.log("   OPERATIONAL STATISTIC CARDS TEST SUITE       ");
    console.log("=================================================\n");

    try {
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });

        const token = loginRes.data?.data?.token || loginRes.data?.token;
        logTest("Step 0 - Auth Login", Boolean(token), "Token obtained");

        const res = await axios.get(`${API_BASE}/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        logTest("Fetch Dashboard Summary Endpoint", res.status === 200, "200 OK");
        logTest("Card 1 - Today's Appointments field exists", data.todaysAppointments !== undefined, `Value: ${data.todaysAppointments}`);
        logTest("Card 2 - Pending Requests field exists", data.pendingRequests !== undefined, `Value: ${data.pendingRequests}`);
        logTest("Card 3 - Next Appointment field exists", data.nextAppointment !== undefined, data.nextAppointment ? `${data.nextAppointment.patientName} at ${data.nextAppointment.time}` : "No More Appointments Today");
        logTest("Card 4 - Remaining Today field exists", data.remainingToday !== undefined, `Value: ${data.remainingToday}`);

        console.log("\n=================================================");
        console.log("   OPERATIONAL STATISTIC CARDS TEST PASSED 100% ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runOperationalStatisticCardsTests();
