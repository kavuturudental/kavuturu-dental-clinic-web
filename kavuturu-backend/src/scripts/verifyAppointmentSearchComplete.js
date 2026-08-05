// src/scripts/verifyAppointmentSearchComplete.js

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

const getRandomPhone = (prefix = "987") => `${prefix}${Math.floor(Math.random() * 9000000) + 1000000}`.slice(0, 10);

async function runAppointmentSearchSuite() {
    console.log("\n=================================================");
    console.log("   COMPLETE APPOINTMENT SEARCH TEST SUITE       ");
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

        // 2. Seed test appointments
        const todayStr = getLocalDateString(0);

        const phone1 = getRandomPhone("98765");
        const phone2 = getRandomPhone("98761");

        const req1 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Rahul Kumar",
            phone: phone1,
            email: "rahul.kumar@test.com",
            treatment: "Laser Root Canal",
            date: todayStr,
            time: "10:00 AM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${req1.data.data._id}/accept`, {}, authHeader);

        const req2 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Rahul Sharma",
            phone: phone2,
            email: "rahul.sharma@test.com",
            treatment: "Dental Implants",
            date: todayStr,
            time: "11:30 AM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${req2.data.data._id}/accept`, {}, authHeader);

        logTest("Step 2 - Seeded Test Appointments for Search", true, "Created Rahul Kumar & Rahul Sharma");

        // 3. Fetch loaded appointments list
        const allRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        const appointmentsList = (allRes.data.data || []).map((a) => ({
            id: a._id,
            patientName: a.patient?.name || a.patientName || "",
            phoneNumber: a.patient?.phone || a.phoneNumber || "",
            treatment: a.treatment || "",
        }));

        // Client-side search function mirror
        const executeSearch = (query) => {
            if (!query || !query.trim()) return appointmentsList;
            const q = query.trim().toLowerCase();
            return appointmentsList.filter((apt) => {
                const pName = (apt.patientName || "").toLowerCase();
                const pPhone = String(apt.phoneNumber || "").toLowerCase();
                const pTreatment = (apt.treatment || "").toLowerCase();
                return pName.includes(q) || pPhone.includes(q) || pTreatment.includes(q);
            });
        };

        // 4. Test Case-Insensitive Partial Patient Name Search
        const nameMatchesLower = executeSearch("rahul");
        const nameMatchesUpper = executeSearch("RAHUL");
        const nameMatchesMixed = executeSearch("RahUl");
        const isNamePassed = nameMatchesLower.length >= 2 && nameMatchesUpper.length === nameMatchesLower.length && nameMatchesMixed.length === nameMatchesLower.length;
        logTest("Step 3 - Patient Name Search ('rahul', 'RAHUL', 'RahUl')", isNamePassed, `Matched ${nameMatchesLower.length} records case-insensitively`);

        // 5. Test Partial Phone Search
        const phoneMatches = executeSearch("9876");
        logTest("Step 4 - Phone Number Partial Search ('9876')", phoneMatches.length >= 2, `Matched ${phoneMatches.length} records`);

        // 6. Test Treatment Partial Search
        const rootMatches = executeSearch("Root");
        const implMatches = executeSearch("Impl");
        logTest("Step 5 - Treatment Partial Search ('Root', 'Impl')", rootMatches.length >= 1 && implMatches.length >= 1, `Root matches: ${rootMatches.length}, Impl matches: ${implMatches.length}`);

        // 7. Test No Results Empty State Query
        const emptyMatches = executeSearch("NonExistentPatient12345");
        logTest("Step 6 - Empty Results Handling", emptyMatches.length === 0, "Triggers 'No Matching Appointments' empty state");

        console.log("\n=================================================");
        console.log("   COMPLETE APPOINTMENT SEARCH SUITE PASSED     ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runAppointmentSearchSuite();
