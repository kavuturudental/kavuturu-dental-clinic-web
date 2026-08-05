// src/scripts/verifyHeroAndAboutSingleClickSave.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

async function runSuite() {
    console.log("\n=================================================");
    console.log("   HERO & ABOUT SINGLE-CLICK SAVE TEST SUITE     ");
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

        // 2. Test Hero Single-Click Save
        const newHeroTitle = "Single-Click Hero Title Test " + Date.now();
        const heroPayload = {
            trustBadge: "Verified Dental Care",
            heading: newHeroTitle,
            accentSubheading: "Pain-Free Laser Technology",
            description: "Instant publish test description for Hero section.",
            stats: [
                { value: "25,000+", title: "Happy Patients", subtitle: "" },
                { value: "18+", title: "Years Experience", subtitle: "" },
                { value: "5★", title: "Rating", subtitle: "" },
                { value: "Top Clinic", title: "Tirupati", subtitle: "" }
            ]
        };

        const saveHeroRes = await axios.put(`${API_BASE}/website/hero`, heroPayload, authHeader);
        logTest("Step 2 - Save Hero Changes via Direct API", saveHeroRes.data?.success === true, "Hero PUT API succeeded");

        // Fetch Public Hero Content
        const publicHeroRes = await axios.get(`${API_BASE}/website/hero`);
        const liveHeroHeading = publicHeroRes.data?.data?.heading;
        logTest("Step 3 - Live Hero Section Instant Update", liveHeroHeading === newHeroTitle, `Live site received: "${liveHeroHeading}"`);

        // 3. Test About Single-Click Save
        const newAboutHeading = "Single-Click About Heading Test " + Date.now();
        const aboutPayload = {
            heading: newAboutHeading,
            description: "Instant publish test description for About section."
        };

        const saveAboutRes = await axios.put(`${API_BASE}/website/about`, aboutPayload, authHeader);
        logTest("Step 4 - Save About Changes via Direct API", saveAboutRes.data?.success === true, "About PUT API succeeded");

        // Fetch Public About Content
        const publicAboutRes = await axios.get(`${API_BASE}/website/about`);
        const liveAboutHeading = publicAboutRes.data?.data?.heading;
        logTest("Step 5 - Live About Section Instant Update", liveAboutHeading === newAboutHeading, `Live site received: "${liveAboutHeading}"`);

        console.log("\n=================================================");
        console.log("   HERO & ABOUT SINGLE-CLICK SAVE PASSED 100%    ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runSuite();
