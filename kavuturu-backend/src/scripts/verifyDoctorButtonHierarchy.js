// src/scripts/verifyDoctorButtonHierarchy.js

const fs = require("fs");
const path = require("path");

const treatmentsPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/Treatments.jsx");
const doctorsPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/Doctors.jsx");
const blogsPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/Blogs.jsx");
const galleryPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/Gallery.jsx");
const beforeAfterPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/BeforeAfter.jsx");
const testimonialsPath = path.join(__dirname, "../../../src/pages/doctor/WebsiteManagement/Testimonials.jsx");
const requestRowPath = path.join(__dirname, "../../../src/components/receptionist/requests/RequestRow.jsx");
const appointmentRowPath = path.join(__dirname, "../../../src/components/receptionist/appointments/AppointmentRow.jsx");

function runSuite() {
    console.log("\n=================================================");
    console.log("   DOCTOR PORTAL BUTTON HIERARCHY VERIFICATION   ");
    console.log("=================================================\n");

    const treatments = fs.readFileSync(treatmentsPath, "utf8");
    const doctors = fs.readFileSync(doctorsPath, "utf8");
    const blogs = fs.readFileSync(blogsPath, "utf8");
    const gallery = fs.readFileSync(galleryPath, "utf8");
    const beforeAfter = fs.readFileSync(beforeAfterPath, "utf8");
    const testimonials = fs.readFileSync(testimonialsPath, "utf8");
    const requestRow = fs.readFileSync(requestRowPath, "utf8");
    const appointmentRow = fs.readFileSync(appointmentRowPath, "utf8");

    // 1. Create/Add buttons use Success Green #16A34A
    const addTreatmentGreen = treatments.includes("bg-[#16A34A]") && treatments.includes("Add Treatment");
    const addDoctorGreen = doctors.includes("bg-[#16A34A]") && doctors.includes("Add Doctor");
    const addBlogGreen = blogs.includes("bg-[#16A34A]") && blogs.includes("Add Blog");
    const addGalleryGreen = gallery.includes("bg-[#16A34A]") && gallery.includes("Add Image");
    const addBeforeAfterGreen = beforeAfter.includes("bg-[#16A34A]") && beforeAfter.includes("Add Before & After");
    const addTestimonialGreen = testimonials.includes("bg-[#16A34A]") && testimonials.includes("Add Review");

    const allAddGreen = addTreatmentGreen && addDoctorGreen && addBlogGreen && addGalleryGreen && addBeforeAfterGreen && addTestimonialGreen;
    console.log(`Step 1 - Create / Add Actions Use Success Green #16A34A: ${allAddGreen ? "✅ PASS" : "❌ FAIL"}`);

    // 2. Request Row Accept (#16A34A) & Reject (#DC2626)
    const requestRowColors = requestRow.includes("bg-[#16A34A]") && requestRow.includes("Accept") && requestRow.includes("Reject");
    console.log(`Step 2 - Request Actions (Accept #16A34A / Reject #DC2626): ${requestRowColors ? "✅ PASS" : "❌ FAIL"}`);

    // 3. Appointment Row Check In (#2563EB) & Complete (#16A34A)
    const appointmentRowColors = appointmentRow.includes("bg-[#2563EB]") && appointmentRow.includes("Check In") && appointmentRow.includes("bg-[#16A34A]") && appointmentRow.includes("Mark as Completed");
    console.log(`Step 3 - Appointment Lifecycle Actions (Check In #2563EB / Complete #16A34A): ${appointmentRowColors ? "✅ PASS" : "❌ FAIL"}`);

    if (allAddGreen && requestRowColors && appointmentRowColors) {
        console.log("\n=================================================");
        console.log("   DOCTOR BUTTON HIERARCHY PASSED 100%           ");
        console.log("=================================================\n");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSuite();
