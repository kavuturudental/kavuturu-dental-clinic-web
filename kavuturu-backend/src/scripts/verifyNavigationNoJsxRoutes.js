// kavuturu-backend/src/scripts/verifyNavigationNoJsxRoutes.js

const fs = require("fs");
const path = require("path");

const footerBottomFile = path.resolve(__dirname, "../../../src/components/website/footer/FooterBottom.jsx");
const footerColumnFile = path.resolve(__dirname, "../../../src/components/website/footer/FooterColumn.jsx");
const footerDataFile = path.resolve(__dirname, "../../../src/components/website/footer/footerData.js");
const appFile = path.resolve(__dirname, "../../../src/App.jsx");

console.log("=================================================");
console.log("  LEGAL PAGES NAVIGATION & ROUTE NORMALIZATION   ");
console.log("=================================================");

let allPassed = true;

// 1. Verify App.jsx routes
const appContent = fs.readFileSync(appFile, "utf-8");
if (appContent.includes("path=\"/privacy-policy\"") && appContent.includes("path=\"/terms-and-conditions\"")) {
  console.log("✅ PASS: App.jsx registers clean routes /privacy-policy and /terms-and-conditions.");
} else {
  console.error("❌ FAIL: App.jsx missing clean legal routes!");
  allPassed = false;
}

// 2. Verify footerData.js links
const footerDataContent = fs.readFileSync(footerDataFile, "utf-8");
if (footerDataContent.includes("/privacy-policy") && footerDataContent.includes("/terms-and-conditions") && !footerDataContent.includes(".jsx")) {
  console.log("✅ PASS: footerData.js uses clean routes /privacy-policy and /terms-and-conditions (no .jsx).");
} else {
  console.error("❌ FAIL: footerData.js contains .jsx or invalid URLs!");
  allPassed = false;
}

// 3. Verify FooterBottom.jsx & normalizeRouteUrl
const footerBottomContent = fs.readFileSync(footerBottomFile, "utf-8");
if (footerBottomContent.includes("normalizeRouteUrl") && footerBottomContent.includes("/privacy-policy") && footerBottomContent.includes("/terms-and-conditions")) {
  console.log("✅ PASS: FooterBottom.jsx includes URL normalizer to prevent component file path requests.");
} else {
  console.error("❌ FAIL: FooterBottom.jsx missing URL normalizer!");
  allPassed = false;
}

// 4. Verify FooterColumn.jsx
const footerColumnContent = fs.readFileSync(footerColumnFile, "utf-8");
if (footerColumnContent.includes("normalizeRouteUrl")) {
  console.log("✅ PASS: FooterColumn.jsx includes URL normalizer for all column links.");
} else {
  console.error("❌ FAIL: FooterColumn.jsx missing URL normalizer!");
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("   LEGAL NAVIGATION VERIFICATION PASSED 100%     ");
} else {
  console.log("   NAVIGATION VERIFICATION FAILED                ");
  process.exit(1);
}
console.log("=================================================");
