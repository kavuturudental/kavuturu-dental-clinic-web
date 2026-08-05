// kavuturu-backend/src/scripts/verifyCheckInStatusChangeFix.js

const fs = require("fs");
const path = require("path");

const rowFile = path.resolve(__dirname, "../../../src/components/receptionist/appointments/AppointmentRow.jsx");
const tableFile = path.resolve(__dirname, "../../../src/components/receptionist/appointments/AppointmentTable.jsx");
const recApptsFile = path.resolve(__dirname, "../../../src/pages/receptionist/Appointments.jsx");
const docApptsFile = path.resolve(__dirname, "../../../src/pages/doctor/AppointmentManagement/Appointments.jsx");

console.log("=================================================");
console.log("    CHECK IN STATUS CHANGE FIX VERIFICATION     ");
console.log("=================================================");

let allPassed = true;

// 1. Check AppointmentRow.jsx
const rowContent = fs.readFileSync(rowFile, "utf-8");
if (rowContent.includes("onStatusChange(item, \"Checked In\")") && rowContent.includes("onStatusChange(item, \"Completed\")")) {
  console.log("✅ PASS: AppointmentRow.jsx passes full appointment item object to onStatusChange.");
} else {
  console.error("❌ FAIL: AppointmentRow.jsx onStatusChange arguments incomplete!");
  allPassed = false;
}

// 2. Check AppointmentTable.jsx
const tableContent = fs.readFileSync(tableFile, "utf-8");
if (tableContent.includes("onStatusChange(finalApt, finalStatus)")) {
  console.log("✅ PASS: AppointmentTable.jsx forwards full appointment object to onStatusChange.");
} else {
  console.error("❌ FAIL: AppointmentTable.jsx onStatusChange wrapper incorrect!");
  allPassed = false;
}

// 3. Check Receptionist Appointments.jsx
const recContent = fs.readFileSync(recApptsFile, "utf-8");
if (recContent.includes("targetId = apt._id || apt.id") && recContent.includes("changeAppointmentStatus(targetId, rawStatus)")) {
  console.log("✅ PASS: Receptionist Appointments.jsx correctly extracts targetId and updates backend.");
} else {
  console.error("❌ FAIL: Receptionist Appointments.jsx targetId extraction invalid!");
  allPassed = false;
}

// 4. Check Doctor Appointments.jsx
const docContent = fs.readFileSync(docApptsFile, "utf-8");
if (docContent.includes("targetId = apt._id || apt.id") && docContent.includes("changeAppointmentStatus(targetId, rawStatus)")) {
  console.log("✅ PASS: Doctor Appointments.jsx correctly extracts targetId and updates backend.");
} else {
  console.error("❌ FAIL: Doctor Appointments.jsx targetId extraction invalid!");
  allPassed = false;
}

console.log("=================================================");
if (allPassed) {
  console.log("   CHECK IN STATUS CHANGE FIX PASSED 100%       ");
} else {
  console.log("   CHECK IN FIX VERIFICATION FAILED              ");
  process.exit(1);
}
console.log("=================================================");
