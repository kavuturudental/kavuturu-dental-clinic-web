// kavuturu-backend/src/scripts/verifyAboutHighlightColor.js

const fs = require("fs");
const path = require("path");

const aboutContentFile = path.resolve(__dirname, "../../../src/components/website/about/AboutContent.jsx");
const aboutIntroFile = path.resolve(__dirname, "../../../src/components/website/about/AboutIntroContent.jsx");

console.log("=================================================");
console.log("   ABOUT SECTION CLINIC NAME HIGHLIGHT VERIFY    ");
console.log("=================================================");

let allPassed = true;

[
  { file: aboutContentFile, name: "AboutContent.jsx" },
  { file: aboutIntroFile, name: "AboutIntroContent.jsx" }
].forEach(({ file, name }) => {
  if (!fs.existsSync(file)) {
    console.error(`❌ File not found: ${name}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(file, "utf-8");
  if (content.includes("text-[#16A34A]") && content.includes("Kavuturu Dental Clinic")) {
    console.log(`✅ PASS: ${name} highlights 'Kavuturu Dental Clinic' in green (#16A34A).`);
  } else {
    console.error(`❌ FAIL: ${name} does not highlight 'Kavuturu Dental Clinic' in green!`);
    allPassed = false;
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("   ABOUT SECTION CLINIC NAME HIGHLIGHT PASSED 100% ");
} else {
  console.log("   HIGLIGHT VERIFICATION FAILED                  ");
  process.exit(1);
}
console.log("=================================================");
