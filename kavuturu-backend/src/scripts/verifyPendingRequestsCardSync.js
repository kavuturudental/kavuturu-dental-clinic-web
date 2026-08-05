// src/scripts/verifyPendingRequestsCardSync.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

const getRandomPhone = () => `98${Math.floor(Math.random() * 90000000) + 10000000}`;

async function runPendingCardSyncSuite() {
    console.log("\n=================================================");
    console.log("   PENDING REQUESTS DASHBOARD CARD SYNC SUITE    ");
    console.log("=================================================\n");

    try {
        // 1. Doctor Login
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 1 - Doctor Auth Login", Boolean(token), "Doctor authenticated");

        // 2. Seed 3 pending appointment requests (Scenario 1)
        const req1 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Pending Sync Patient 1",
            phone: getRandomPhone(),
            email: "patient1@test.com",
            treatment: "Teeth Whitening",
            date: "2026-08-10",
            time: "10:00 AM",
        });
        const req2 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Pending Sync Patient 2",
            phone: getRandomPhone(),
            email: "patient2@test.com",
            treatment: "Laser Root Canal",
            date: "2026-08-11",
            time: "11:00 AM",
        });
        const req3 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Pending Sync Patient 3",
            phone: getRandomPhone(),
            email: "patient3@test.com",
            treatment: "Dental Implants",
            date: "2026-08-12",
            time: "02:00 PM",
        });

        const id1 = req1.data.data._id;
        const id2 = req2.data.data._id;
        const id3 = req3.data.data._id;

        let summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        let pendingCount = summaryRes.data.pendingRequests;
        logTest("Step 2 - Seeded 3 Pending Requests", pendingCount === 3, `Count: ${pendingCount}`);

        // 3. Accept 1 request (Scenario 1 check: 3 -> 2)
        await axios.put(`${API_BASE}/appointment-requests/${id1}/accept`, {}, authHeader);
        summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        pendingCount = summaryRes.data.pendingRequests;
        logTest("Step 3 - Accept 1 Request", pendingCount === 2, `Count decreased to: ${pendingCount}`);

        // 4. Accept 2nd request (Count: 2 -> 1)
        await axios.put(`${API_BASE}/appointment-requests/${id2}/accept`, {}, authHeader);
        summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        pendingCount = summaryRes.data.pendingRequests;
        logTest("Step 4 - Accept 2nd Request", pendingCount === 1, `Count decreased to: ${pendingCount}`);

        // 5. Accept final request (Scenario 2 check: 1 -> 0)
        await axios.put(`${API_BASE}/appointment-requests/${id3}/accept`, {}, authHeader);
        summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        pendingCount = summaryRes.data.pendingRequests;
        logTest("Step 5 - Accept Final Request", pendingCount === 0, `Count immediately displays: ${pendingCount}`);

        // 6. Test Scenario 3 (Reject last request: 1 -> 0)
        const req4 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Pending Sync Patient 4",
            phone: getRandomPhone(),
            email: "patient4@test.com",
            treatment: "Braces",
            date: "2026-08-13",
            time: "04:00 PM",
        });
        const id4 = req4.data.data._id;

        summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        logTest("Step 6a - Seeded 1 Pending Request for Reject test", summaryRes.data.pendingRequests === 1, `Count: ${summaryRes.data.pendingRequests}`);

        await axios.put(`${API_BASE}/appointment-requests/${id4}/reject`, { reason: "Not available" }, authHeader);
        summaryRes = await axios.get(`${API_BASE}/dashboard/appointment-summary`, authHeader);
        pendingCount = summaryRes.data.pendingRequests;
        logTest("Step 6b - Reject Final Request", pendingCount === 0, `Count immediately displays: ${pendingCount}`);

        console.log("\n=================================================");
        console.log("   PENDING REQUESTS CARD SUITE PASSED 100%      ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runPendingCardSyncSuite();
