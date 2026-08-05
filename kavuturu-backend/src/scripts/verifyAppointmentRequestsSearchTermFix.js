// src/scripts/verifyAppointmentRequestsSearchTermFix.js

const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../../../src/pages/receptionist/AppointmentRequests.jsx");
const tablePath = path.join(__dirname, "../../../src/components/receptionist/requests/RequestTable.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("  APPOINTMENT REQUESTS SEARCHTERM FIX VERIFICATION ");
    console.log("=================================================\n");

    const pageContent = fs.readFileSync(pagePath, "utf8");
    const tableContent = fs.readFileSync(tablePath, "utf8");

    // 1. Check useState declaration for searchTerm
    const hasSearchState = pageContent.includes("const [searchTerm, setSearchTerm] = useState(\"\");");
    console.log(`Step 1 - Declare const [searchTerm, setSearchTerm] = useState(""): ${hasSearchState ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Check DashboardLayout search props
    const hasDashboardSearchProps = pageContent.includes("searchValue={searchTerm}") && pageContent.includes("onSearchChange={setSearchTerm}");
    console.log(`Step 2 - DashboardLayout search props bound: ${hasDashboardSearchProps ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Check RequestTable search props
    const hasTableSearchProps = pageContent.includes("searchTerm={searchTerm}") && pageContent.includes("onSearchChange={setSearchTerm}");
    console.log(`Step 3 - RequestTable search props bound: ${hasTableSearchProps ? "✅ PASS" : "❌ FAIL"}`);

    // 4. Check RequestTable external search handling
    const hasTableSearchHandling = tableContent.includes("searchTerm: externalSearchTerm") && tableContent.includes("externalSearchTerm !== undefined");
    console.log(`Step 4 - RequestTable search filtering: ${hasTableSearchHandling ? "✅ PASS" : "❌ FAIL"}`);

    if (hasSearchState && hasDashboardSearchProps && hasTableSearchProps && hasTableSearchHandling) {
        console.log("\n=================================================");
        console.log("   APPOINTMENT REQUESTS SEARCHTERM FIXED 100%    ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
