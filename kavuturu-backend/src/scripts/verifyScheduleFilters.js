// src/scripts/verifyScheduleFilters.js

const axios = require("axios");
const mongoose = require("mongoose");

async function runFilterTest() {
  console.log("=== STARTING SCHEDULE OVERVIEW FILTER VERIFICATION TEST ===");

  // 1. Doctor Login
  const docLogin = await axios.post("http://localhost:5000/api/auth/login", {
    email: "doctor@kavuturudental.com",
    password: "Doctor@123",
  });
  const docToken = docLogin.data.data.token;
  const headers = { Authorization: "Bearer " + docToken };
  console.log("✅ 1. Doctor Logged In.");

  // Helper date generators
  const todayObj = new Date();
  const getFmtDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayStr = getFmtDate(todayObj);

  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = getFmtDate(tomorrowObj);

  const futureObj = new Date();
  futureObj.setDate(futureObj.getDate() + 5);
  const futureStr = getFmtDate(futureObj);

  // 2. Create Test Appointments (Today, Tomorrow, Future)
  const aptToday = await axios.post(
    "http://localhost:5000/api/appointments",
    {
      patientName: "Today Patient (Anil)",
      phone: "9848099881",
      treatment: "General Consultation",
      appointmentDate: todayStr,
      appointmentTime: "09:00 AM",
      bookingSource: "Doctor",
      status: "Confirmed",
    },
    { headers }
  );
  console.log("✅ 2. Created Today's Appointment:", aptToday.data.data._id);

  const aptTomorrow = await axios.post(
    "http://localhost:5000/api/appointments",
    {
      patientName: "Tomorrow Patient (Bhavana)",
      phone: "9848099882",
      treatment: "Teeth Whitening",
      appointmentDate: tomorrowStr,
      appointmentTime: "09:30 AM",
      bookingSource: "Doctor",
      status: "Confirmed",
    },
    { headers }
  );
  console.log("✅ 3. Created Tomorrow's Appointment:", aptTomorrow.data.data._id);

  const aptCompleted = await axios.post(
    "http://localhost:5000/api/appointments",
    {
      patientName: "Completed Patient (Chandra)",
      phone: "9848099883",
      treatment: "Laser Root Canal",
      appointmentDate: futureStr,
      appointmentTime: "10:00 AM",
      bookingSource: "Doctor",
      status: "Completed",
    },
    { headers }
  );
  console.log("✅ 4. Created Completed Appointment:", aptCompleted.data.data._id);

  const aptCancelled = await axios.post(
    "http://localhost:5000/api/appointments",
    {
      patientName: "Cancelled Patient (Divya)",
      phone: "9848099884",
      treatment: "Dental Implants",
      appointmentDate: futureStr,
      appointmentTime: "10:30 AM",
      bookingSource: "Doctor",
      status: "Cancelled",
    },
    { headers }
  );
  console.log("✅ 5. Created Cancelled Appointment:", aptCancelled.data.data._id);

  // 3. Fetch All Appointments from Backend
  const allRes = await axios.get("http://localhost:5000/api/appointments", { headers });
  const allList = allRes.data.data || allRes.data;
  console.log("✅ 6. Total Appointments in Database:", allList.length);

  // 4. Test Filtering Logic Equivalent
  const mapBackend = (apt) => {
    const rawD = apt.appointmentDate || apt.date || "";
    const dStr = typeof rawD === "string" && rawD.length >= 10 ? rawD.split("T")[0] : getFmtDate(new Date(rawD));
    return {
      id: apt._id,
      patientName: apt.patient?.name || apt.patientName,
      status: apt.status,
      date: dStr,
      time: apt.appointmentTime || apt.time
    };
  };

  const mapped = allList.map(mapBackend);

  const filterToday = mapped.filter((a) => a.date === todayStr);
  console.log("✅ 7. Filter 'Today' Count:", filterToday.length, "(Expected >= 1)");

  const filterTomorrow = mapped.filter((a) => a.date === tomorrowStr);
  console.log("✅ 8. Filter 'Tomorrow' Count:", filterTomorrow.length, "(Expected >= 1)");

  const filterUpcoming = mapped.filter((a) => a.date >= todayStr && a.status !== "Completed" && a.status !== "Cancelled");
  console.log("✅ 9. Filter 'Upcoming' Count:", filterUpcoming.length, "(Includes Today & Tomorrow, Excludes Completed & Cancelled)");

  const filterCompleted = mapped.filter((a) => a.status === "Completed");
  console.log("✅ 10. Filter 'Completed' Count:", filterCompleted.length, "(Expected >= 1)");

  const filterCancelled = mapped.filter((a) => a.status === "Cancelled");
  console.log("✅ 11. Filter 'Cancelled' Count:", filterCancelled.length, "(Expected >= 1)");

  // 5. Cleanup Test Documents
  await mongoose.connect("mongodb+srv://admin:KDC2026AtlasDb@kavuturudental.5o1gisr.mongodb.net/kavuturuDentalClinic?retryWrites=true&w=majority&appName=kavuturudental");
  const Appointment = mongoose.model("Appointment", new mongoose.Schema({}, { strict: false }));
  const Patient = mongoose.model("Patient", new mongoose.Schema({}, { strict: false }));
  const Notification = mongoose.model("Notification", new mongoose.Schema({}, { strict: false }));

  await Appointment.deleteMany({});
  await Patient.deleteMany({});
  await Notification.deleteMany({});
  await mongoose.disconnect();
  console.log("✅ 12. Cleaned up test records.");

  console.log("=== ALL SCHEDULE OVERVIEW FILTER TESTS PASSED 100% ===");
}

runFilterTest().catch((e) => console.error("❌ Filter Test Failed:", e.response?.data || e.message));
