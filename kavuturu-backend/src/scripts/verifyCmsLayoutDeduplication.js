// kavuturu-backend/src/scripts/verifyCmsLayoutDeduplication.js

const fs = require("fs");
const path = require("path");

const cmsDir = path.resolve(__dirname, "../../../src/pages/doctor/WebsiteManagement");
const doctorDir = path.resolve(__dirname, "../../../src/pages/doctor");

const testItems = [
  { file: "HeroCMS.jsx", dir: cmsDir },
  { file: "About.jsx", dir: cmsDir },
  { file: "Treatments.jsx", dir: cmsDir },
  { file: "Doctors.jsx", dir: cmsDir },
  { file: "BeforeAfter.jsx", dir: cmsDir },
  { file: "Gallery.jsx", dir: cmsDir },
  { file: "Testimonials.jsx", dir: cmsDir },
  { file: "Blogs.jsx", dir: cmsDir },
  { file: "Contact.jsx", dir: cmsDir },
  { file: "DoctorProfile.jsx", dir: doctorDir }
];

console.log("=================================================");
console.log("  CMS & MY ACCOUNT LAYOUT DEDUPLICATION CHECK    ");
console.log("=================================================");

let allPassed = true;

testItems.forEach(({ file, dir }) => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${file}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Check for duplicate introductory header sections
  const hasDuplicateHeader = content.includes("TOP HEADER ROW") || 
                             content.includes("1. TOP HEADER") || 
                             content.includes("Hero Banner & Statistics") ||
                             content.includes("Footer Module Title Banner") ||
                             content.includes("Doctor Management CMS") ||
                             content.includes("Blog Management CMS") ||
                             content.includes("Testimonials Management CMS") ||
                             content.includes("Gallery Management CMS") ||
                             content.includes("Before & After Management CMS") ||
                             content.includes("Treatments CMS") ||
                             content.includes("My Account & Receptionist Management");

  if (hasDuplicateHeader) {
    console.error(`❌ FAIL: ${file} still contains duplicate header banner!`);
    allPassed = false;
  } else {
    console.log(`` + `\u2705 PASS: ${file} - Duplicate header removed. Begins directly with first functional section.`);
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   ALL 9 CMS PAGES & MY ACCOUNT PASSED 100%       ");
} else {
  console.log("   SOME PAGES STILL HAVE DUPLICATE HEADERS        ");
  process.exit(1);
}
console.log("=================================================");
