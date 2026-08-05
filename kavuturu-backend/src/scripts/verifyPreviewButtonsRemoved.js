// src/scripts/verifyPreviewButtonsRemoved.js

const fs = require("fs");
const path = require("path");

const cmsDir = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement");

function runCheck() {
    console.log("\n=================================================");
    console.log("   VERIFY REMOVAL OF ALL PREVIEW BUTTONS SUITE   ");
    console.log("=================================================\n");

    const files = fs.readdirSync(cmsDir).filter(f => f.endsWith(".jsx"));
    let failCount = 0;

    files.forEach(file => {
        const filePath = path.join(cmsDir, file);
        const content = fs.readFileSync(filePath, "utf8");

        // Scan for buttons containing Preview text (case insensitive) within a single button tag
        const buttonRegex = /<button[\s\S]*?<\/button>/gi;
        const buttonMatches = content.match(buttonRegex) || [];
        
        let previewButtonsInFile = 0;
        buttonMatches.forEach(btn => {
            // Check if the button is a page preview action button (e.g. Preview Website, Live Preview, or Preview with Eye icon)
            if (/Preview Website|Live Preview|>Preview<|>Preview\s|<span>Preview<\/span>/i.test(btn) && !/imagepreview|previewmodal|setbeforepreview|setafterpreview/i.test(btn)) {
                console.log(`❌ Found Preview button in ${file}:`, btn.replace(/\s+/g, ' ').substring(0, 100));
                previewButtonsInFile++;
            }
        });

        // Special check for onClick={handlePreviewWebsite} or onClick={handleTriggerPreview} or onClick={handleTogglePreview}
        const onClickPreviewRegex = /onClick=\{(?:handlePreviewWebsite|handleTriggerPreview|handleTogglePreview)\}/g;
        const onClickMatches = content.match(onClickPreviewRegex) || [];

        const totalPreviewFound = previewButtonsInFile + onClickMatches.length;

        if (totalPreviewFound > 0) {
            console.log(`❌ [FAIL] ${file}: Found ${totalPreviewFound} Preview button(s)`);
            failCount++;
        } else {
            console.log(`` + `✅ [PASS] ${file}: 0 Preview buttons found`);
        }
    });

    console.log("\n=================================================");
    if (failCount === 0) {
        console.log("   PREVIEW BUTTONS REMOVAL PASSED 100% SUCCESS   ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        console.log(`   FAILED: ${failCount} file(s) still contain Preview buttons`);
        console.log("=================================================\n");
        process.exit(1);
    }
}

runCheck();
