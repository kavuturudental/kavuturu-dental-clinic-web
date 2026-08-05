// src/scripts/verifyRichTextEditorFix.js

const fs = require("fs");
const path = require("path");

const editorPath = path.join(__dirname, "../../../src/components/doctor/website/RichTextEditor.jsx");

function verifyEditor() {
    console.log("\n=================================================");
    console.log("   RICH TEXT EDITOR FIX VERIFICATION SUITE       ");
    console.log("=================================================\n");

    const content = fs.readFileSync(editorPath, "utf8");

    // 1. Check handleAddLink definition
    const hasHandleAddLinkDef = content.includes("const handleAddLink =");
    console.log(`Step 1 - handleAddLink Defined: ${hasHandleAddLinkDef ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Check onClick handler binding
    const hasOnClickBinding = content.includes("onClick={handleAddLink}");
    console.log(`Step 2 - onClick Handler Binding: ${hasOnClickBinding ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Scan for any undefined handler references
    const onClickMatches = content.match(/onClick=\{([a-zA-Z0-9_]+)\}/g) || [];
    let undefinedHandlers = 0;
    onClickMatches.forEach(m => {
        const handlerName = m.replace("onClick={", "").replace("}", "");
        const isDefined = content.includes(`const ${handlerName} =`) || content.includes(`function ${handlerName}`);
        if (!isDefined) {
            console.log(`❌ Undefined onClick handler found: ${handlerName}`);
            undefinedHandlers++;
        }
    });

    console.log(`Step 3 - Undefined Handlers Scan: ${undefinedHandlers === 0 ? "✅ PASS (0 undefined handlers)" : "❌ FAIL"}`);

    if (hasHandleAddLinkDef && hasOnClickBinding && undefinedHandlers === 0) {
        console.log("\n=================================================");
        console.log("   RICH TEXT EDITOR FIX PASSED 100% SUCCESS     ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

verifyEditor();
