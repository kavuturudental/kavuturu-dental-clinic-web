// src/scripts/verifyMobileNumberValidation.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runMobileNumberValidationTests() {
    console.log("\n=================================================");
    console.log("   MOBILE NUMBER VALIDATION TEST SUITE           ");
    console.log("=================================================\n");

    const testCases = [
        { phone: "987654321", label: "Less than 10 digits (9 digits)", shouldPass: false },
        { phone: "98765432101", label: "More than 10 digits (11 digits)", shouldPass: false },
        { phone: "98A6543210", label: "Contains alphabets", shouldPass: false },
        { phone: "98765@3210", label: "Contains special characters", shouldPass: false },
        { phone: "98765 43210", label: "Contains spaces", shouldPass: false },
    ];

    let allPassed = true;

    // Test Invalid Cases
    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const payload = {
            name: "Test Patient",
            phone: tc.phone,
            email: "test@example.com",
            treatment: "Laser Root Canal",
            date: "2026-12-25",
            time: "10:00 AM",
            notes: "Mobile validation test",
        };

        try {
            await axios.post(`${API_BASE}/appointment-requests`, payload);
            logTest(`Test ${i + 1} - ${tc.label} ("${tc.phone}")`, false, "Unexpectedly ACCEPTED request!");
            allPassed = false;
        } catch (err) {
            const is400 = err.response && err.response.status === 400;
            const msg = err.response?.data?.message || err.message;
            logTest(`Test ${i + 1} - ${tc.label} ("${tc.phone}")`, is400, `Rejected correctly with 400: "${msg}"`);
            if (!is400) allPassed = false;
        }
    }

    // Test Valid Case
    const validPhone = `98${Math.floor(Math.random() * 90000000) + 10000000}`;
    const validPayload = {
        name: "Valid Patient",
        phone: validPhone,
        email: "valid@example.com",
        treatment: "Laser Root Canal",
        date: "2026-12-28",
        time: "11:00 AM",
        notes: "Valid mobile test",
    };

    try {
        const res = await axios.post(`${API_BASE}/appointment-requests`, validPayload);
        logTest(`Test 6 - Exactly 10 numeric digits ("${validPhone}")`, res.status === 201, `Accepted correctly with 201 Created`);
    } catch (err) {
        logTest(`Test 6 - Exactly 10 numeric digits ("${validPhone}")`, false, err.response?.data?.message || err.message);
        allPassed = false;
    }

    console.log("\n=================================================");
    if (allPassed) {
        console.log("   MOBILE NUMBER VALIDATION PASSED 100% SUCCESS  ");
    } else {
        console.log("   MOBILE NUMBER VALIDATION TEST FAILED          ");
    }
    console.log("=================================================\n");

    process.exit(allPassed ? 0 : 1);
}

runMobileNumberValidationTests();
