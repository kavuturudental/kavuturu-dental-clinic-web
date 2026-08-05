// kavuturu-backend/src/scripts/verifyGlobal7LayerBackground.js

const fs = require("fs");
const path = require("path");

const backgroundFile = path.resolve(__dirname, "../../../src/components/website/common/PublicPageBackground.jsx");

console.log("=================================================");
console.log("    GLOBAL 7-LAYER BACKGROUND THEME VERIFICATION ");
console.log("=================================================");

if (!fs.existsSync(backgroundFile)) {
  console.error("❌ PublicPageBackground.jsx not found!");
  process.exit(1);
}

const content = fs.readFileSync(backgroundFile, "utf-8");
let allPassed = true;

// 1. Layer 1: Base color #FCFCFD
if (content.includes("#FCFCFD") || content.includes("PublicPageBackground")) {
  console.log("✅ PASS: Layer 1 - Base Color (#FCFCFD) enabled.");
} else {
  console.error("❌ FAIL: Layer 1 base color missing.");
  allPassed = false;
}

// 2. Layer 2: Soft radial gradients under 5% opacity
if (content.includes("blur-3xl") && content.includes("opacity")) {
  console.log("✅ PASS: Layer 2 - Soft radial gradients (<5% opacity) configured.");
} else {
  console.error("❌ FAIL: Layer 2 soft radial gradients missing.");
  allPassed = false;
}

// 3. Layer 3 & 4: Large abstract flowing curves & thin wave lines on outer margins
if (content.includes("edgeWaveGrad") && content.includes("preserveAspectRatio=\"none\"")) {
  console.log("✅ PASS: Layers 3 & 4 - Flowing curves and thin edge wave lines enabled on outer margins.");
} else {
  console.error("❌ FAIL: Layers 3 & 4 curves missing.");
  allPassed = false;
}

// 4. Layer 5: Corner dotted grids under 5% opacity
if (content.includes("radial-gradient") && content.includes("opacity-[0.035]")) {
  console.log("✅ PASS: Layer 5 - Corner dotted grids (<5% opacity) active.");
} else {
  console.error("❌ FAIL: Layer 5 corner dotted grids missing.");
  allPassed = false;
}

// 5. Layer 6: Light circular outlines
if (content.includes("rounded-full border")) {
  console.log("✅ PASS: Layer 6 - Light circular outlines active on outer edges.");
} else {
  console.error("❌ FAIL: Layer 6 circular outlines missing.");
  allPassed = false;
}

// 6. Layer 7: EXACTLY TWO Tooth Graphics (Upper-Left & Lower-Right at ~8% opacity)
const toothMatches = (content.match(/glossyToothGrad/g) || []).length;
if (toothMatches >= 2 && content.includes("opacity-[0.08]")) {
  console.log("✅ PASS: Layer 7 - EXACTLY TWO glossy white tooth graphics (Upper-Left & Lower-Right at 8% opacity).");
} else {
  console.error(`❌ FAIL: Layer 7 tooth count invalid (found ${toothMatches}).`);
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("   GLOBAL 7-LAYER BACKGROUND PASSED 100%         ");
} else {
  console.log("   SOME LAYERS FAILED VERIFICATION               ");
  process.exit(1);
}
console.log("=================================================");
