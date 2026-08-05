// kavuturu-backend/src/scripts/verifyTargetModulesCloudinaryIntegration.js

const fs = require("fs");
const path = require("path");

console.log("=================================================");
console.log("  TARGET MODULES CLOUDINARY INTEGRATION VERIFY    ");
console.log("=================================================");

let allPassed = true;

// 1. Verify Target Models & Controllers
const targetModules = [
  {
    name: "Treatments",
    model: path.resolve(__dirname, "../models/Treatment.js"),
    controller: path.resolve(__dirname, "../controllers/treatmentController.js"),
    fields: ["public_id"]
  },
  {
    name: "Before & After",
    model: path.resolve(__dirname, "../models/BeforeAfter.js"),
    controller: path.resolve(__dirname, "../controllers/beforeAfterController.js"),
    fields: ["before_public_id", "after_public_id"]
  },
  {
    name: "Gallery",
    model: path.resolve(__dirname, "../models/Gallery.js"),
    controller: path.resolve(__dirname, "../controllers/galleryController.js"),
    fields: ["public_id"]
  },
  {
    name: "Blogs",
    model: path.resolve(__dirname, "../models/Blog.js"),
    controller: path.resolve(__dirname, "../controllers/blogController.js"),
    fields: ["public_id"]
  }
];

targetModules.forEach((mod) => {
  const modelContent = fs.readFileSync(mod.model, "utf-8");
  const controllerContent = fs.readFileSync(mod.controller, "utf-8");

  const modelFieldsOk = mod.fields.every((f) => modelContent.includes(f));
  const controllerIntegratesCloudinary = controllerContent.includes("processCloudinaryImage") && controllerContent.includes("deleteFromCloudinary");

  if (modelFieldsOk && controllerIntegratesCloudinary) {
    console.log(`✅ PASS: Module [${mod.name}] model contains public_id fields and controller integrates Cloudinary Upload/Replace/Delete.`);
  } else {
    console.error(`❌ FAIL: Module [${mod.name}] missing Cloudinary integration or public_id fields!`);
    allPassed = false;
  }
});

// 2. Verify Non-Target Modules are UNTOUCHED
const nonTargetControllers = [
  { name: "Hero", file: path.resolve(__dirname, "../controllers/heroController.js") },
  { name: "About", file: path.resolve(__dirname, "../controllers/aboutController.js") },
  { name: "Doctor", file: path.resolve(__dirname, "../controllers/doctorController.js") },
  { name: "Testimonial", file: path.resolve(__dirname, "../controllers/testimonialController.js") },
  { name: "Contact", file: path.resolve(__dirname, "../controllers/contactController.js") },
  { name: "Appointment", file: path.resolve(__dirname, "../controllers/appointmentController.js") },
  { name: "Auth", file: path.resolve(__dirname, "../controllers/authController.js") },
];

nonTargetControllers.forEach((mod) => {
  if (fs.existsSync(mod.file)) {
    const content = fs.readFileSync(mod.file, "utf-8");
    if (!content.includes("processCloudinaryImage")) {
      console.log(`✅ PASS: Non-target module [${mod.name}] remains completely untouched.`);
    } else {
      console.error(`❌ FAIL: Non-target module [${mod.name}] was modified!`);
      allPassed = false;
    }
  }
});

console.log("=================================================");
if (allPassed) {
  console.log("  TARGET MODULES CLOUDINARY VERIFY PASSED 100%    ");
} else {
  console.log("  VERIFICATION FAILED                            ");
  process.exit(1);
}
console.log("=================================================");
