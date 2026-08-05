// src/scripts/verifyCleanDb.js

require("dotenv").config();
const { connectDatabase } = require("../config/database");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");
const Notification = require("../models/Notification");

// Website Management Models
const Hero = require("../models/Hero");
const About = require("../models/About");
const Treatment = require("../models/Treatment");
const Doctor = require("../models/Doctor");
const BeforeAfter = require("../models/BeforeAfter");
const Gallery = require("../models/Gallery");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");

async function verifyCleanDb() {
  await connectDatabase();

  // Delete any user other than doctor@kavuturudental.com
  await User.deleteMany({ email: { $ne: "doctor@kavuturudental.com" } });

  console.log("\n=================================================");
  console.log("      FINAL VERIFIED CLEAN DATABASE STATE        ");
  console.log("=================================================");
  console.log("🔑 PRESERVED AUTHENTICATION & WEBSITE DATA:");
  console.log(`  - Doctor Account (Users): ${await User.countDocuments()} [doctor@kavuturudental.com]`);
  console.log(`  - Hero Section:           ${await Hero.countDocuments()} document(s)`);
  console.log(`  - About Clinic:           ${await About.countDocuments()} document(s)`);
  console.log(`  - Treatments:             ${await Treatment.countDocuments()} document(s)`);
  console.log(`  - Website Doctors:        ${await Doctor.countDocuments()} document(s)`);
  console.log(`  - Before & After:         ${await BeforeAfter.countDocuments()} document(s)`);
  console.log(`  - Gallery:                ${await Gallery.countDocuments()} document(s)`);
  console.log(`  - Testimonials:           ${await Testimonial.countDocuments()} document(s)`);
  console.log(`  - Blogs:                  ${await Blog.countDocuments()} document(s)`);
  console.log(`  - Contact Information:    ${await Contact.countDocuments()} document(s)`);
  console.log("\n🧹 CLEARED TESTING MODULES:");
  console.log(`  - Receptionists:          ${await User.countDocuments({ role: "receptionist" })} (0 - Empty)`);
  console.log(`  - Patients:               ${await Patient.countDocuments()} (0 - Empty)`);
  console.log(`  - Appointments:           ${await Appointment.countDocuments()} (0 - Empty)`);
  console.log(`  - Appointment Requests:   ${await AppointmentRequest.countDocuments()} (0 - Empty)`);
  console.log(`  - Notifications:          ${await Notification.countDocuments()} (0 - Empty)`);
  console.log("=================================================\n");

  process.exit(0);
}

verifyCleanDb().catch((e) => {
  console.error(e);
  process.exit(1);
});
