// src/scripts/verifySingleSaveButton.js

const fs = require("fs");
const path = require("path");

const profilePath = path.join(__dirname, "../../../src/pages/doctor/DoctorProfile.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   VERIFY SINGLE SAVE ALL CHANGES BUTTON         ");
    console.log("=================================================\n");

    const content = fs.readFileSync(profilePath, "utf8");
    const matches = content.match(/Save All Changes/g) || [];

    console.log(`Occurrences of 'Save All Changes' in DoctorProfile.jsx: ${matches.length}`);

    if (matches.length === 1) {
        console.log("\n=================================================");
        console.log("   SINGLE SAVE BUTTON VERIFICATION PASSED 100%   ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        console.log("❌ FAIL: Expected exactly 1 button.");
        process.exit(1);
    }
}

runSuite();
