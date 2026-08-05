// src/scripts/verifyReceptionistPortalNavRefinements.js

const fs = require("fs");
const path = require("path");

const sidebarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Sidebar.jsx");
const topbarPath = path.join(__dirname, "../../../src/components/receptionist/layout/Topbar.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("  RECEPTIONIST SIDEBAR & TOPBAR VERIFICATION SUITE ");
    console.log("=================================================\n");

    const sidebarContent = fs.readFileSync(sidebarPath, "utf8");
    const topbarContent = fs.readFileSync(topbarPath, "utf8");

    // 1. Sidebar Green Badge check
    const hasGreenBadge = sidebarContent.includes("bg-emerald-50") && sidebarContent.includes("text-emerald-700") && sidebarContent.includes("Receptionist Portal");
    console.log(`Step 1 - Highlighted Green Receptionist Portal Badge: ${hasGreenBadge ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Sidebar Navigation Items equal height check (h-[42px])
    const hasEqualHeightItems = sidebarContent.includes("h-[42px]");
    console.log(`Step 2 - Equal Height Navigation Items (h-[42px]): ${hasEqualHeightItems ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Sidebar Bottom ONLY Logout button check (no profile card / help center / widgets)
    const hasLogout = sidebarContent.includes("handleLogout");
    const hasRemovedExtraFooterProfile = !sidebarContent.includes("user?.email || \"receptionist@kavuturudental.com\"");
    console.log(`Step 3 - Sidebar Bottom ONLY Logout Button: ${hasLogout && hasRemovedExtraFooterProfile ? "✅ PASS" : "❌ FAIL"}`);

    // 4. Topbar Centered Search Bar check
    const hasCenteredSearch = (topbarContent.includes("absolute left-1/2") || topbarContent.includes("justify-center")) && topbarContent.includes("Search");
    console.log(`Step 4 - Topbar Centered Search Bar: ${hasCenteredSearch ? "✅ PASS" : "❌ FAIL"}`);

    // 5. Topbar Combined Date & Time Card check
    const hasCombinedDateTime = topbarContent.includes("Calendar") && topbarContent.includes("Clock") && topbarContent.includes("formattedTime");
    console.log(`Step 5 - Topbar Combined Date & Time Card: ${hasCombinedDateTime ? "✅ PASS" : "❌ FAIL"}`);

    // 6. Topbar Single Profile check
    const hasSingleProfile = topbarContent.includes("displayName") && topbarContent.includes("Profile");
    console.log(`Step 6 - Topbar Single Profile Dropdown: ${hasSingleProfile ? "✅ PASS" : "❌ FAIL"}`);

    if (hasGreenBadge && hasEqualHeightItems && hasLogout && hasRemovedExtraFooterProfile && hasCenteredSearch && hasCombinedDateTime && hasSingleProfile) {
        console.log("\n=================================================");
        console.log("   RECEPTIONIST NAV REFINEMENTS PASSED 100%       ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
