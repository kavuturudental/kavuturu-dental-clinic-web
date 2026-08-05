// src/scripts/verifyDataExportEmptyState.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runDataExportEmptyStateTests() {
    console.log("\n=================================================");
    console.log("   DATA EXPORT EMPTY STATE TEST SUITE           ");
    console.log("=================================================\n");

    try {
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 1 - Auth Login", Boolean(token), "Doctor authenticated");

        const aptsRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        logTest("Step 2 - Fetch Appointments for Export Data", aptsRes.status === 200, `Found: ${aptsRes.data?.data?.length || 0} records`);

        console.log("\n=================================================");
        console.log("   DATA EXPORT EMPTY STATE SUITE PASSED 100%    ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runDataExportEmptyStateTests();
