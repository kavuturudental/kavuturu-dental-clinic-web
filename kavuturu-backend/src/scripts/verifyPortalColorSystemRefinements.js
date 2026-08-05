// src/scripts/verifyPortalColorSystemRefinements.js

const fs = require("fs");
const path = require("path");

const recepSidebarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Sidebar.jsx");
const docSidebarPath = path.join(__dirname, "../../../src/components/doctor/layout/Sidebar.jsx");
const recepTopbarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Topbar.jsx");
const docTopbarPath = path.join(__dirname, "../../../src/components/doctor/layout/Topbar.jsx");
const layoutPath = path.join(__dirname, "../../../src/layouts/ReceptionistLayout.jsx");
const summaryCardsPath = path.join(__dirname, "../../../src/components/common/DashboardSummaryCards.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   INTERNAL PORTALS COLOR SYSTEM VERIFICATION   ");
    console.log("=================================================\n");

    const recepSidebar = fs.readFileSync(recepSidebarPath, "utf8");
    const docSidebar = fs.readFileSync(docSidebarPath, "utf8");
    const recepTopbar = fs.readFileSync(recepTopbarPath, "utf8");
    const docTopbar = fs.readFileSync(docTopbarPath, "utf8");
    const layout = fs.readFileSync(layoutPath, "utf8");
    const summaryCards = fs.readFileSync(summaryCardsPath, "utf8");

    // 1. Primary #2563EB & Light Blue #EFF6FF active nav item
    const recepActiveNav = recepSidebar.includes("bg-[#EFF6FF]") && recepSidebar.includes("text-[#2563EB]");
    const docActiveNav = docSidebar.includes("bg-[#EFF6FF]") && docSidebar.includes("text-[#2563EB]");
    console.log(`Step 1 - Primary #2563EB & Subtle Light Blue #EFF6FF Active Navigation: ${recepActiveNav && docActiveNav ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Success #16A34A & Soft Green #F0FDF4 Badges
    const recepBadge = recepSidebar.includes("bg-[#F0FDF4]") && recepSidebar.includes("text-[#16A34A]");
    const docBadge = docSidebar.includes("bg-[#F0FDF4]") && docSidebar.includes("text-[#16A34A]");
    console.log(`Step 2 - Success #16A34A & Soft Green #F0FDF4 Badges: ${recepBadge && docBadge ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Main Background #F8FAFC
    const hasCanvasBg = layout.includes("bg-[#F8FAFC]");
    console.log(`Step 3 - Main Canvas Background #F8FAFC: ${hasCanvasBg ? "✅ PASS" : "❌ FAIL"}`);

    // 4. Card Borders #E5E7EB & KPI Cards Palette
    const hasCardBorders = summaryCards.includes("border-[#E5E7EB]") && summaryCards.includes("text-[#2563EB]") && summaryCards.includes("text-[#16A34A]");
    console.log(`Step 4 - Card Border #E5E7EB & Summary Cards Palette: ${hasCardBorders ? "✅ PASS" : "❌ FAIL"}`);

    if (recepActiveNav && docActiveNav && recepBadge && docBadge && hasCanvasBg && hasCardBorders) {
        console.log("\n=================================================");
        console.log("   PORTAL COLOR SYSTEM SUITE PASSED 100%         ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
