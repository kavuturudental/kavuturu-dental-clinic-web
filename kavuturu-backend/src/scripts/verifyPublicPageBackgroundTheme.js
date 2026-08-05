// kavuturu-backend/src/scripts/verifyPublicPageBackgroundTheme.js

const fs = require("fs");
const path = require("path");

const pagesDir = path.resolve(__dirname, "../../../src/pages/website");

console.log("=================================================");
console.log("    PUBLIC WEBSITE BACKGROUND THEME CHECK        ");
console.log("=================================================");

let allPassed = true;

const pagesToCheck = [
  "Home.jsx",
  "About.jsx",
  "Treatments.jsx",
  "Doctors.jsx",
  "Gallery.jsx",
  "BeforeAfter.jsx",
  "Testimonials.jsx",
  "Blogs.jsx",
  "BookAppointment.jsx"
];

pagesToCheck.forEach((file) => {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${file}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  const usesFCFCFD = content.includes("bg-[#FCFCFD]");
  const usesPublicBackground = content.includes("PublicPageBackground");

  if (usesFCFCFD && usesPublicBackground) {
    console.log(`✅ PASS: ${file} uses unified #FCFCFD background & PublicPageBackground overlay.`);
  } else {
    console.error(`❌ FAIL: ${file} missing #FCFCFD or PublicPageBackground!`);
    allPassed = false;
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   ALL PUBLIC WEBSITE PAGES BACKGROUND PASSED 100% ");
} else {
  console.log("   SOME PAGES FAILED BACKGROUND THEME CHECK        ");
  process.exit(1);
}
console.log("=================================================");
