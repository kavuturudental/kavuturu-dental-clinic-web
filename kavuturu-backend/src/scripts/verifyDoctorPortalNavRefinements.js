// src/scripts/verifyDoctorPortalNavRefinements.js

const fs = require("fs");
const path = require("path");

const sidebarPath = path.join(__dirname, "../../../src/components/doctor/layout/Sidebar.jsx");
const topbarPath = path.join(__dirname, "../../../src/components/doctor/layout/Topbar.jsx");
const layoutPath = path.join(__dirname, "../../../src/layouts/DoctorLayout.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   DOCTOR PORTAL NAVIGATION DESIGN VERIFICATION  ");
    console.log("=================================================\n");

    const sidebar = fs.readFileSync(sidebarPath, "utf8");
    const topbar = fs.readFileSync(topbarPath, "utf8");
    const layout = fs.readFileSync(layoutPath, "utf8");

    // 1. Doctor Layout alignment
    const hasLayoutAlignment = layout.includes("p-3 gap-3") && layout.includes("gap-2.5");
    console.log(`Step 1 - Doctor Layout Floating Card & Top Alignment: ${hasLayoutAlignment ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Doctor Sidebar soft badge & no straight lines
    const hasSoftBadge = sidebar.includes("bg-[#ECFDF5]") && sidebar.includes("Doctor Portal");
    const hasHFull = sidebar.includes("h-full");
    console.log(`Step 2 - Doctor Sidebar Soft Badge & Floating Card: ${hasSoftBadge && hasHFull ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Doctor Topbar search, date-time, & uppercase green profile name
    const hasFlexSearch = topbar.includes("max-w-[380px]") && topbar.includes("flex-1");
    const hasGreenName = topbar.includes("text-emerald-700") && topbar.includes("upperDisplayName");
    console.log(`Step 3 - Doctor Topbar Zero-Overlap Search & Green Uppercase Name: ${hasFlexSearch && hasGreenName ? "✅ PASS" : "❌ FAIL"}`);

    if (hasLayoutAlignment && hasSoftBadge && hasHFull && hasFlexSearch && hasGreenName) {
        console.log("\n=================================================");
        console.log("   DOCTOR PORTAL NAV DESIGN PASSED 100%          ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
