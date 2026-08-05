// src/scripts/resetDatabaseForTesting.js

require("dotenv").config();
const { connectDatabase } = require("../config/database");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");
const Notification = require("../models/Notification");
const Counter = require("../models/Counter");

// Website Management Models (Must be PRESERVED)
const Hero = require("../models/Hero");
const About = require("../models/About");
const Treatment = require("../models/Treatment");
const Doctor = require("../models/Doctor");
const BeforeAfter = require("../models/BeforeAfter");
const Gallery = require("../models/Gallery");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");

async function resetDatabase() {
  console.log("=================================================");
  console.log("  ONE-TIME DATABASE RESET FOR FINAL E2E TESTING  ");
  console.log("=================================================");

  await connectDatabase();

  // 1. Clear Operational Documents
  console.log("\n🧹 CLEARING OPERATIONAL DOCUMENTS...");
  
  const deletedPatients = await Patient.deleteMany({});
  console.log(`✅ Deleted Patients: ${deletedPatients.deletedCount}`);

  const deletedAppointments = await Appointment.deleteMany({});
  console.log(`✅ Deleted Appointments: ${deletedAppointments.deletedCount}`);

  const deletedRequests = await AppointmentRequest.deleteMany({});
  console.log(`✅ Deleted Appointment Requests: ${deletedRequests.deletedCount}`);

  const deletedNotifications = await Notification.deleteMany({});
  console.log(`✅ Deleted Notifications: ${deletedNotifications.deletedCount}`);

  const deletedCounters = await Counter.deleteMany({});
  console.log(`✅ Deleted Counters: ${deletedCounters.deletedCount}`);

  // Delete all users
  await User.deleteMany({});

  // 2. Create Fresh Doctor Account (Pass plaintext password, User.js pre-save hook will hash it once)
  console.log("\n👨‍⚕️ CREATING DOCTOR ACCOUNT...");

  const doctor = await User.create({
    name: "Dr. K. Ravindra Babu",
    qualification: "BDS, MDS – Conservative Dentistry & Endodontics",
    email: "doctor@kavuturudental.com",
    password: "Doctor@123",
    role: "doctor",
    phone: "9876543210",
    isActive: true,
  });
  console.log("✅ Doctor Account Created Cleanly ID:", doctor._id);

  // 3. Log Final Document Counts
  console.log("\n📊 AFTER RESET DOCUMENT COUNTS:");
  console.log("-----------------------------------");
  console.log(`- Doctor Users: ${await User.countDocuments()} (Doctor Only)`);
  console.log(`- Receptionist Accounts: ${await User.countDocuments({ role: "receptionist" })} (0 - Empty)`);
  console.log(`- Patients: ${await Patient.countDocuments()} (0 - Empty)`);
  console.log(`- Appointments: ${await Appointment.countDocuments()} (0 - Empty)`);
  console.log(`- Appointment Requests: ${await AppointmentRequest.countDocuments()} (0 - Empty)`);
  console.log(`- Notifications: ${await Notification.countDocuments()} (0 - Empty)`);
  console.log("-----------------------------------");
  console.log(`[PRESERVED] Hero: ${await Hero.countDocuments()}`);
  console.log(`[PRESERVED] About: ${await About.countDocuments()}`);
  console.log(`[PRESERVED] Treatments: ${await Treatment.countDocuments()}`);
  console.log(`[PRESERVED] Doctors: ${await Doctor.countDocuments()}`);
  console.log(`[PRESERVED] BeforeAfter: ${await BeforeAfter.countDocuments()}`);
  console.log(`[PRESERVED] Gallery: ${await Gallery.countDocuments()}`);
  console.log(`[PRESERVED] Testimonials: ${await Testimonial.countDocuments()}`);
  console.log(`[PRESERVED] Blogs: ${await Blog.countDocuments()}`);
  console.log(`[PRESERVED] Contact Info: ${await Contact.countDocuments()}`);

  console.log("\n=================================================");
  console.log("  DATABASE RESET COMPLETE FOR TESTING!           ");
  console.log("=================================================");
  process.exit(0);
}

resetDatabase().catch((err) => {
  console.error("❌ Reset Error:", err);
  process.exit(1);
});
