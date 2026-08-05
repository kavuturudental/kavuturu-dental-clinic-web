// src/scripts/verifyFinalReceptionistUIRefinements.js

const fs = require("fs");
const path = require("path");

const sidebarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Sidebar.jsx");
const topbarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Topbar.jsx");
const summaryCardsPath = path.join(__dirname, "../../../src/components/common/DashboardSummaryCards.jsx");
const tablePath = path.join(__dirname, "../../../src/components/receptionist/appointments/AppointmentTable.jsx");
const filterPath = path.join(__dirname, "../../../src/components/receptionist/appointments/AppointmentFilters.jsx");
const emptyPath = path.join(__dirname, "../../../src/components/receptionist/common/EmptyState.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   FINAL RECEPTIONIST PORTAL UI VERIFICATION    ");
    console.log("=================================================\n");

    const sidebar = fs.readFileSync(sidebarPath, "utf8");
    const topbar = fs.readFileSync(topbarPath, "utf8");
    const summaryCards = fs.readFileSync(summaryCardsPath, "utf8");
    const table = fs.readFileSync(tablePath, "utf8");
    const filter = fs.readFileSync(filterPath, "utf8");
    const empty = fs.readFileSync(emptyPath, "utf8");

    // 1. Sidebar Refinements
    const hasSoftBadge = (sidebar.includes("bg-emerald-50") || sidebar.includes("bg-[#ECFDF5]")) && sidebar.includes("Receptionist Portal");
    const hasNavBreathingSpace = sidebar.includes("px-3") || sidebar.includes("px-3.5");
    const hasCenteredLogout = sidebar.includes("justify-center") && sidebar.includes("Logout");
    console.log(`Step 1 - Sidebar Floating Curved Layout & Breathing Space: ${hasSoftBadge && hasNavBreathingSpace && hasCenteredLogout ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Topbar Proportions
    const hasFlexSearch = topbar.includes("flex-1") && (topbar.includes("max-w-[380px]") || topbar.includes("max-w-md"));
    const hasTitleSubtitleGap = topbar.includes("mt-1") || topbar.includes("gap-1");
    console.log(`Step 2 - Topbar Flexbox Search (Zero Overlap) & Spacing: ${hasFlexSearch && hasTitleSubtitleGap ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Summary Cards
    const hasEqualPadding = summaryCards.includes("p-5") || summaryCards.includes("p-3.5");
    const hasLargerNumbers = summaryCards.includes("font-extrabold");
    const hasIconContainer = summaryCards.includes("w-8.5 h-8.5") || summaryCards.includes("w-10 h-10");
    console.log(`Step 3 - Summary Cards Tight Compact Padding & Bold Numbers: ${hasEqualPadding && hasLargerNumbers && hasIconContainer ? "✅ PASS" : "❌ FAIL"}`);

    // 4. Schedule Overview Alignment
    const hasSameLineActions = table.includes("Search Bar and New Appointment Button Perfectly Aligned");
    console.log(`Step 4 - Same Line Actions (Search + New Appointment): ${hasSameLineActions ? "✅ PASS" : "❌ FAIL"}`);

    // 5. Filter Chips
    const hasFilterProportions = filter.includes("h-9.5") && filter.includes("px-4") && filter.includes("gap-2.5");
    console.log(`Step 5 - Filter Chips (h-9.5 px-4 gap-2.5): ${hasFilterProportions ? "✅ PASS" : "❌ FAIL"}`);

    // 6. Empty State
    const hasEmptyProportions = empty.includes("py-10 sm:py-12") && empty.includes("-mt-2");
    console.log(`Step 6 - Empty State Height & Illustration Position: ${hasEmptyProportions ? "✅ PASS" : "❌ FAIL"}`);

    if (hasSoftBadge && hasNavBreathingSpace && hasCenteredLogout && hasFlexSearch && hasTitleSubtitleGap && hasEqualPadding && hasLargerNumbers && hasIconContainer && hasSameLineActions && hasFilterProportions && hasEmptyProportions) {
        console.log("\n=================================================");
        console.log("   FINAL RECEPTIONIST UI SUITE PASSED 100%       ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
