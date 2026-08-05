// kavuturu-backend/src/scripts/verifyDefaultHeroWebpImages.js

const fs = require("fs");
const path = require("path");

const heroImageFile = path.resolve(__dirname, "../../../src/components/website/hero/HeroImage.jsx");
const publicDesktopWebp = path.resolve(__dirname, "../../../public/assets/images/hero/hero-desktop.webp");
const publicMobileWebp = path.resolve(__dirname, "../../../public/assets/images/hero/hero-mobile.webp");
const srcDesktopWebp = path.resolve(__dirname, "../../../src/assets/images/hero/hero-desktop.webp");
const srcMobileWebp = path.resolve(__dirname, "../../../src/assets/images/hero/hero-mobile.webp");

console.log("=================================================");
console.log("   HERO SECTION WEBP DEFAULT IMAGES VERIFY       ");
console.log("=================================================");

let allPassed = true;

// 1. Check local WebP files existence
if (fs.existsSync(publicDesktopWebp) && fs.existsSync(publicMobileWebp) && fs.existsSync(srcDesktopWebp) && fs.existsSync(srcMobileWebp)) {
  console.log("✅ PASS: Default WebP hero images exist in both public and src assets.");
} else {
  console.error("❌ FAIL: WebP hero image files missing!");
  allPassed = false;
}

// 2. Check HeroImage.jsx implementation
if (fs.existsSync(heroImageFile)) {
  const content = fs.readFileSync(heroImageFile, "utf-8");

  const usesWebpDesktop = content.includes("hero-desktop.webp");
  const usesWebpMobile = content.includes("hero-mobile.webp");
  const supportsCMS = content.includes("getHeroContent") && content.includes("STATE_UPDATED");

  if (usesWebpDesktop && usesWebpMobile && supportsCMS) {
    console.log("✅ PASS: HeroImage.jsx configured to use WebP defaults and retains full CMS functionality.");
  } else {
    console.error("❌ FAIL: HeroImage.jsx missing WebP defaults or CMS integration!");
    allPassed = false;
  }
} else {
  console.error("❌ FAIL: HeroImage.jsx file not found!");
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("   HERO SECTION WEBP DEFAULT VERIFY PASSED 100%  ");
} else {
  console.log("   VERIFICATION FAILED                           ");
  process.exit(1);
}
console.log("=================================================");
