// src/scripts/verifySingleSaveButtonHeroAndAbout.js

const fs = require("fs");
const path = require("path");
const axios = require("axios");

const heroPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/HeroCMS.jsx");
const aboutPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/About.jsx");
const API_BASE = "http://localhost:5000/api";

function countSaveButtons(filePath, label) {
    const content = fs.readFileSync(filePath, "utf8");
    const buttonRegex = /<button[\s\S]*?>[\s\S]*?Save Changes[\s\S]*?<\/button>/gi;
    const matches = content.match(buttonRegex) || [];
    console.log(`Checking ${label}: Found ${matches.length} "Save Changes" button(s)`);
    return matches.length;
}

async function runSuite() {
    console.log("\n=================================================");
    console.log("   SINGLE SAVE BUTTON HERO & ABOUT TEST SUITE    ");
    console.log("=================================================\n");

    const heroButtonCount = countSaveButtons(heroPath, "HeroCMS.jsx");
    const aboutButtonCount = countSaveButtons(aboutPath, "About.jsx");

    const passStatic = (heroButtonCount === 1) && (aboutButtonCount === 1);
    console.log(`Static Check Hero (Exactly 1 Button): ${heroButtonCount === 1 ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Static Check About (Exactly 1 Button): ${aboutButtonCount === 1 ? "✅ PASS" : "❌ FAIL"}`);

    if (!passStatic) {
        console.log("❌ Static button count check failed!");
        process.exit(1);
    }

    // 2. Doctor Auth Login & API E2E Functional Test
    try {
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // Test Hero Save
        const testHeroTitle = "Single Save Button Hero Test " + Date.now();
        await axios.put(`${API_BASE}/website/hero`, {
            trustBadge: "Eluru Dental Care",
            heading: testHeroTitle,
            accentSubheading: "Laser Dentistry",
            description: "Single button save verification for Hero.",
            stats: [
                { value: "25k+", title: "Patients", subtitle: "" },
                { value: "18+", title: "Years", subtitle: "" },
                { value: "5★", title: "Google", subtitle: "" },
                { value: "Trusted", title: "Eluru", subtitle: "" }
            ]
        }, authHeader);

        const liveHeroRes = await axios.get(`${API_BASE}/website/hero`);
        const heroSaved = liveHeroRes.data?.data?.heading === testHeroTitle;
        console.log(`API Hero Save Verification: ${heroSaved ? "✅ PASS" : "❌ FAIL"}`);

        // Test About Save
        const testAboutHeading = "Single Save Button About Test " + Date.now();
        await axios.put(`${API_BASE}/website/about`, {
            heading: testAboutHeading,
            description: "Single button save verification for About."
        }, authHeader);

        const liveAboutRes = await axios.get(`${API_BASE}/website/about`);
        const aboutSaved = liveAboutRes.data?.data?.heading === testAboutHeading;
        console.log(`API About Save Verification: ${aboutSaved ? "✅ PASS" : "❌ FAIL"}`);

        if (heroSaved && aboutSaved) {
            console.log("\n=================================================");
            console.log("   SINGLE SAVE BUTTON SUITE PASSED 100% SUCCESS  ");
            console.log("=================================================\n");
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (err) {
        console.error("API Verification Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runSuite();
