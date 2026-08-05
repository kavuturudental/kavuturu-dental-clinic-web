// kavuturu-backend/src/scripts/verifyLegalPages.js

const fs = require("fs");
const path = require("path");

const appFile = path.resolve(__dirname, "../../../src/App.jsx");
const privacyFile = path.resolve(__dirname, "../../../src/pages/website/PrivacyPolicy.jsx");
const termsFile = path.resolve(__dirname, "../../../src/pages/website/TermsAndConditions.jsx");
const footerDataFile = path.resolve(__dirname, "../../../src/components/website/footer/footerData.js");

console.log("=================================================");
console.log("    LEGAL PAGES (PRIVACY & TERMS) VERIFICATION   ");
console.log("=================================================");

let allPassed = true;

// 1. Verify App.jsx routes
const appContent = fs.readFileSync(appFile, "utf-8");
if (appContent.includes("path=\"/privacy-policy\"") && appContent.includes("path=\"/terms-and-conditions\"")) {
  console.log("✅ PASS: App.jsx includes public routes /privacy-policy and /terms-and-conditions.");
} else {
  console.error("❌ FAIL: App.jsx missing legal routes!");
  allPassed = false;
}

// 2. Verify footer links
const footerDataContent = fs.readFileSync(footerDataFile, "utf-8");
if (footerDataContent.includes("/privacy-policy") && footerDataContent.includes("/terms-and-conditions")) {
  console.log("✅ PASS: Footer links configure /privacy-policy and /terms-and-conditions.");
} else {
  console.error("❌ FAIL: Footer data missing legal page links!");
  allPassed = false;
}

// 3. Verify PrivacyPolicy.jsx
if (fs.existsSync(privacyFile)) {
  const privacyContent = fs.readFileSync(privacyFile, "utf-8");
  if (privacyContent.includes("Privacy Policy") && privacyContent.includes("getContact") && privacyContent.includes("Information We Collect")) {
    console.log("✅ PASS: PrivacyPolicy.jsx is created with required sections & dynamic contact info.");
  } else {
    console.error("❌ FAIL: PrivacyPolicy.jsx missing required sections or dynamic contact!");
    allPassed = false;
  }
} else {
  console.error("❌ FAIL: PrivacyPolicy.jsx file not found!");
  allPassed = false;
}

// 4. Verify TermsAndConditions.jsx
if (fs.existsSync(termsFile)) {
  const termsContent = fs.readFileSync(termsFile, "utf-8");
  if (termsContent.includes("Terms & Conditions") && termsContent.includes("getContact") && termsContent.includes("Acceptance of Terms")) {
    console.log("✅ PASS: TermsAndConditions.jsx is created with required sections & dynamic contact info.");
  } else {
    console.error("❌ FAIL: TermsAndConditions.jsx missing required sections or dynamic contact!");
    allPassed = false;
  }
} else {
  console.error("❌ FAIL: TermsAndConditions.jsx file not found!");
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("   LEGAL PAGES VERIFICATION PASSED 100%          ");
} else {
  console.log("   LEGAL PAGES VERIFICATION FAILED               ");
  process.exit(1);
}
console.log("=================================================");
