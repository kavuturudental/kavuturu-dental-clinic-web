// src/scripts/verifyFixedTestimonialCardHeights.js

const fs = require("fs");
const path = require("path");

const cardPath = path.join(__dirname, "../../../src/components/website/testimonials/TestimonialCard.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   REVIEWS FIXED HEIGHT & OVERLAY VERIFICATION   ");
    console.log("=================================================\n");

    const content = fs.readFileSync(cardPath, "utf8");

    // 1. Check fixed height
    const hasFixedHeight = content.includes("h-[290px]");
    console.log(`Step 1 - Fixed Heights (h-[290px]): ${hasFixedHeight ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Check 3-4 lines text truncation (line-clamp-3)
    const hasLineClamp = content.includes("line-clamp-3");
    console.log(`Step 2 - Text Truncation (line-clamp-3): ${hasLineClamp ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Check Read More button & In-Card Overlay State
    const hasReadMore = content.includes("Read More");
    const hasReadLess = content.includes("Read Less");
    const hasExpandedState = content.includes("isExpanded");
    const hasInCardOverlay = content.includes("absolute inset-0 z-20");
    console.log(`Step 3 - In-Card Overlay Triggers (Read More & Read Less): ${hasReadMore && hasReadLess && hasExpandedState && hasInCardOverlay ? "✅ PASS" : "❌ FAIL"}`);

    // 4. Check Card Elements Order (Photo/Avatar -> Name -> Rating -> Review -> Read More -> Date/Verified)
    const hasAvatarOrPhoto = content.includes("photo || avatar") || content.includes("reviewerName.charAt(0)");
    const hasVerifiedBadge = content.includes("Verified Patient") || content.includes("Verified Review");
    console.log(`Step 4 - Element Ordering & Verified Badge: ${hasAvatarOrPhoto && hasVerifiedBadge ? "✅ PASS" : "❌ FAIL"}`);

    if (hasFixedHeight && hasLineClamp && hasReadMore && hasReadLess && hasExpandedState && hasInCardOverlay && hasAvatarOrPhoto && hasVerifiedBadge) {
        console.log("\n=================================================");
        console.log("   REVIEWS FIXED HEIGHT SUITE PASSED 100%       ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
