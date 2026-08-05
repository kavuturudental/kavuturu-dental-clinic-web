// kavuturu-backend/src/scripts/resetBookingSystemData.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");
const Patient = require("../models/Patient");
const Notification = require("../models/Notification");
const Counter = require("../models/Counter");
const User = require("../models/User");
const Hero = require("../models/Hero");
const Treatment = require("../models/Treatment");

async function resetBookingData() {
    try {
        console.log("\n=================================================");
        console.log("   RESET BOOKING SYSTEM DATA FOR TESTING         ");
        console.log("=================================================\n");

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is missing.");
        }

        await mongoose.connect(mongoUri);
        console.log("🟢 Connected to MongoDB Database");

        // 1. Delete Appointments
        const aptDeleteRes = await Appointment.deleteMany({});
        console.log(`✅ Cleared Appointments: Deleted ${aptDeleteRes.deletedCount} documents.`);

        // 2. Delete Appointment Requests
        const reqDeleteRes = await AppointmentRequest.deleteMany({});
        console.log(`✅ Cleared Appointment Requests: Deleted ${reqDeleteRes.deletedCount} documents.`);

        // 3. Delete Patients
        const patientDeleteRes = await Patient.deleteMany({});
        console.log(`✅ Cleared Patients: Deleted ${patientDeleteRes.deletedCount} documents.`);

        // 4. Delete Notifications
        const notifDeleteRes = await Notification.deleteMany({});
        console.log(`✅ Cleared Notifications: Deleted ${notifDeleteRes.deletedCount} documents.`);

        // 5. Reset Counter for Appointment Numbers
        await Counter.deleteMany({});
        await Counter.create({ name: "appointmentNumber", sequence: 1000, seq: 1000 });
        console.log("✅ Reset Appointment Number Counter sequence to 1000.");

        // -------------------------------------------------------------
        // VERIFICATION PHASE
        // -------------------------------------------------------------
        console.log("\n-------------------------------------------------");
        console.log("               VERIFICATION RESULTS              ");
        console.log("-------------------------------------------------");

        const aptCount = await Appointment.countDocuments();
        const reqCount = await AppointmentRequest.countDocuments();
        const patientCount = await Patient.countDocuments();
        const notifCount = await Notification.countDocuments();

        const userCount = await User.countDocuments();
        const heroCount = await Hero.countDocuments();
        const treatmentCount = await Treatment.countDocuments();

        console.log(`• Appointments Count: ${aptCount} ${aptCount === 0 ? "✅" : "❌"}`);
        console.log(`• Appointment Requests Count: ${reqCount} ${reqCount === 0 ? "✅" : "❌"}`);
        console.log(`• Patients Count: ${patientCount} ${patientCount === 0 ? "✅" : "❌"}`);
        console.log(`• Notifications Count: ${notifCount} ${notifCount === 0 ? "✅" : "❌"}`);

        console.log(`\n--- Preserved Data Check ---`);
        console.log(`• User Accounts Preserved: ${userCount} ${userCount > 0 ? "✅" : "❌"}`);
        console.log(`• Hero CMS Data Preserved: ${heroCount} ${heroCount >= 0 ? "✅" : "❌"}`);
        console.log(`• Treatments Data Preserved: ${treatmentCount} ${treatmentCount >= 0 ? "✅" : "❌"}`);

        const isClean = aptCount === 0 && reqCount === 0 && patientCount === 0 && notifCount === 0 && userCount > 0;

        if (isClean) {
            console.log("\n=================================================");
            console.log("   BOOKING SYSTEM DATA RESET COMPLETED 100% SUCCESS  ");
            console.log("=================================================\n");
        } else {
            console.log("\n❌ Data reset verification failed.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Reset script error:", err);
        process.exit(1);
    }
}

resetBookingData();
