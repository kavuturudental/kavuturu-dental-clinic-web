// kavuturu-backend/src/scripts/verifyHomepageSpacing.js

const fs = require("fs");
const path = require("path");

const websiteComponentsDir = path.resolve(__dirname, "../../../src/components/website");
const commonComponentsDir = path.resolve(__dirname, "../../../src/components/common");

console.log("=================================================");
console.log("    HOMEPAGE REFINED SPACING VERIFICATION        ");
console.log("=================================================");

let allPassed = true;

const sectionsToCheck = [
  { path: path.join(websiteComponentsDir, "about/AboutSection.jsx"), name: "AboutSection" },
  { path: path.join(websiteComponentsDir, "home/TreatmentsSection.jsx"), name: "TreatmentsSection" },
  { path: path.join(websiteComponentsDir, "home/doctors/DoctorsSection.jsx"), name: "DoctorsSection" },
  { path: path.join(websiteComponentsDir, "home/before-after/BeforeAfterSection.jsx"), name: "BeforeAfterSection" },
  { path: path.join(websiteComponentsDir, "testimonials/TestimonialsSection.jsx"), name: "TestimonialsSection" },
  { path: path.join(websiteComponentsDir, "home/gallery/GallerySection.jsx"), name: "GallerySection" },
  { path: path.join(websiteComponentsDir, "home/blogs/BlogSection.jsx"), name: "BlogSection" },
  { path: path.join(websiteComponentsDir, "home/contact/ContactSection.jsx"), name: "ContactSection" },
  { path: path.join(commonComponentsDir, "InnerPageCTA.jsx"), name: "InnerPageCTA" }
];

sectionsToCheck.forEach(({ path: filePath, name }) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${name}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Check for refined padding class
  if (content.includes("py-12 sm:py-16 lg:py-20")) {
    console.log(`✅ PASS: ${name} uses refined compact spacing (py-12 sm:py-16 lg:py-20).`);
  } else {
    console.error(`❌ FAIL: ${name} does not use refined spacing!`);
    allPassed = false;
  }

  // Ensure no old py-20 lg:py-28 padding remains
  if (content.includes("py-20 lg:py-28")) {
    console.error(`❌ FAIL: ${name} still contains old py-20 lg:py-28 padding!`);
    allPassed = false;
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   HOMEPAGE SPACING VERIFICATION PASSED 100%     ");
} else {
  console.log("   SOME SECTIONS FAILED SPACING CHECK            ");
  process.exit(1);
}
console.log("=================================================");
