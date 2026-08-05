// kavuturu-backend/src/scripts/verifyLegalPagesTypography.js

const fs = require("fs");
const path = require("path");

const privacyFile = path.resolve(__dirname, "../../../src/pages/website/PrivacyPolicy.jsx");
const termsFile = path.resolve(__dirname, "../../../src/pages/website/TermsAndConditions.jsx");

console.log("=================================================");
console.log("    LEGAL PAGES TYPOGRAPHY UNIFICATION CHECK     ");
console.log("=================================================");

let allPassed = true;

[
  { file: privacyFile, name: "PrivacyPolicy.jsx" },
  { file: termsFile, name: "TermsAndConditions.jsx" }
].forEach(({ file, name }) => {
  if (!fs.existsSync(file)) {
    console.error(`❌ File not found: ${name}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(file, "utf-8");

  const hasOutfitHeadings = content.includes("font-outfit");
  const hasStandardBodyText = content.includes("text-base sm:text-lg text-slate-600 leading-relaxed");
  const hasStandardH1 = content.includes("text-4xl sm:text-[40px] md:text-5xl lg:text-6xl");

  if (hasOutfitHeadings && hasStandardBodyText && hasStandardH1) {
    console.log(`✅ PASS: ${name} typography updated to match website font (Outfit headings, text-base sm:text-lg body text).`);
  } else {
    console.error(`❌ FAIL: ${name} typography does not match website standard!`);
    allPassed = false;
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   LEGAL PAGES TYPOGRAPHY VERIFICATION PASSED 100%");
} else {
  console.log("   TYPOGRAPHY VERIFICATION FAILED                 ");
  process.exit(1);
}
console.log("=================================================");
