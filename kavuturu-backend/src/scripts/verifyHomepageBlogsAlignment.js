// src/scripts/verifyHomepageBlogsAlignment.js

const fs = require("fs");
const path = require("path");

const blogSectionPath = path.join(__dirname, "../../../src/components/website/home/blogs/BlogSection.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   HOMEPAGE BLOGS ALIGNMENT VERIFICATION SUITE   ");
    console.log("=================================================\n");

    const content = fs.readFileSync(blogSectionPath, "utf8");

    // Check dynamic getLayoutClass implementation
    const hasGetLayoutClass = content.includes("getLayoutClass");
    const has1BlogClass = content.includes("max-w-md") && content.includes("grid-cols-1");
    const has2BlogsClass = content.includes("max-w-3xl") && content.includes("md:grid-cols-2");
    const has3BlogsClass = content.includes("max-w-6xl") && content.includes("lg:grid-cols-3");
    const hasJustifyCenter = content.includes("justify-center");

    console.log(`Step 1 - Dynamic Layout Helper (getLayoutClass): ${hasGetLayoutClass ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Step 2 - 1 Blog Centered Layout (max-w-md grid-cols-1): ${has1BlogClass ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Step 3 - 2 Blogs Centered Layout (max-w-3xl md:grid-cols-2): ${has2BlogsClass ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Step 4 - 3 Blogs Centered Layout (max-w-6xl lg:grid-cols-3): ${has3BlogsClass ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Step 5 - Horizontal Centering (justify-center): ${hasJustifyCenter ? "✅ PASS" : "❌ FAIL"}`);

    if (hasGetLayoutClass && has1BlogClass && has2BlogsClass && has3BlogsClass && hasJustifyCenter) {
        console.log("\n=================================================");
        console.log("   HOMEPAGE BLOGS ALIGNMENT SUITE PASSED 100%   ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
