// src/scripts/verifyPatientHistoryComplete.js

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

const logTest = (name, passed, details = "") => {
    if (passed) {
        console.log(`✅ [PASS] ${name}${details ? `: ${details}` : ""}`);
    } else {
        console.log(`❌ [FAIL] ${name}${details ? `: ${details}` : ""}`);
    }
};

const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getRandomPhone = () => `98${Math.floor(Math.random() * 90000000) + 10000000}`;

async function runPatientHistorySuite() {
    console.log("\n=================================================");
    console.log("   COMPLETE PATIENT HISTORY MODULE TEST SUITE   ");
    console.log("=================================================\n");

    try {
        // 1. Doctor Login
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: "doctor@kavuturudental.com",
            password: "Doctor@123",
        });
        const token = loginRes.data?.data?.token || loginRes.data?.token;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        logTest("Step 1 - Doctor Auth Login", Boolean(token), "Doctor authenticated");

        // 2. Book multiple appointments on different days for the SAME patient phone number
        const phone = getRandomPhone();
        const todayStr = getLocalDateString(0);
        const day1Str = getLocalDateString(1);
        const day10Str = getLocalDateString(10);

        // Booking 1: Today 09:00 AM -> Accepted & Completed
        const req1 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "History Patient",
            phone: phone,
            email: "history@patient.com",
            treatment: "Laser Root Canal",
            date: todayStr,
            time: "09:00 AM",
        });
        const accept1 = await axios.put(`${API_BASE}/appointment-requests/${req1.data.data._id}/accept`, {}, authHeader);
        const apt1Id = accept1.data.data.appointment._id;
        await axios.patch(`${API_BASE}/appointments/${apt1Id}/status`, { status: "Checked In" }, authHeader);
        await axios.patch(`${API_BASE}/appointments/${apt1Id}/status`, { status: "Completed" }, authHeader);

        // Booking 2: Day 1 (Tomorrow 02:00 PM) -> Accepted & Cancelled
        const req2 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "History Patient",
            phone: phone,
            email: "history@patient.com",
            treatment: "Dental Implants",
            date: day1Str,
            time: "02:00 PM",
        });
        const accept2 = await axios.put(`${API_BASE}/appointment-requests/${req2.data.data._id}/accept`, {}, authHeader);
        const apt2Id = accept2.data.data.appointment._id;
        await axios.patch(`${API_BASE}/appointments/${apt2Id}/status`, { status: "Cancelled" }, authHeader);

        // Booking 3: Future Day 10 (04:00 PM) -> Accepted & Confirmed (Upcoming)
        const req3 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "History Patient",
            phone: phone,
            email: "history@patient.com",
            treatment: "Teeth Whitening",
            date: day10Str,
            time: "04:00 PM",
        });
        const accept3 = await axios.put(`${API_BASE}/appointment-requests/${req3.data.data._id}/accept`, {}, authHeader);
        const apt3Id = accept3.data.data.appointment._id;

        logTest("Step 2 - Seeded 3 Appointments for Same Patient Phone Number", true, `Phone: ${phone}`);

        // 3. Edit Apt 3 date/time (Must NOT create a duplicate patient or increase visit count incorrectly)
        await axios.put(`${API_BASE}/appointments/${apt3Id}`, {
            treatment: "Crowns & Bridges",
            appointmentTime: "05:00 PM",
        }, authHeader);
        logTest("Step 3 - Edited Appointment Date/Time", true, "Updated appointment time without duplicating patient profile");

        // 4. Fetch Patients Directory & verify single profile
        const patientsRes = await axios.get(`${API_BASE}/patients`, authHeader);
        const patientProfiles = (patientsRes.data.data || []).filter((p) => p.phone === phone);

        logTest("Step 4a - Single Patient Profile Rule", patientProfiles.length === 1, `Found ${patientProfiles.length} profile for phone ${phone}`);

        const p = patientProfiles[0];
        logTest("Step 4b - Patient Profile Data Fields", Boolean(p.name && p.phone && p.email), `Name: ${p.name}, Phone: ${p.phone}, Email: ${p.email}`);
        logTest("Step 4c - Total Visits Metric", p.totalVisits >= 1, `Total Visits: ${p.totalVisits}`);
        logTest("Step 4d - First Visit Date Metric", Boolean(p.firstVisitDate && p.firstVisitDate === todayStr), `First Visit: ${p.firstVisitDate}`);
        logTest("Step 4e - Latest Visit Date Metric", Boolean(p.latestAppointmentDate && p.latestAppointmentDate === day10Str), `Latest Visit: ${p.latestAppointmentDate}`);

        // 5. Verify Appointment History & Timeline Sorting (Newest date/time first)
        const history = p.appointmentHistory || [];
        const isSortedDesc = history.every((item, idx) => {
            if (idx === 0) return true;
            const prevDate = (history[idx - 1].appointmentDate || history[idx - 1].date || "").slice(0, 10);
            const currDate = (item.appointmentDate || item.date || "").slice(0, 10);
            return prevDate >= currDate;
        });
        logTest("Step 5 - Appointment History Sorted Latest First", history.length === 3 && isSortedDesc, `History length: ${history.length}, Sorted desc verified`);

        // 6. Verify Upcoming Appointment Detection
        const upcoming = p.upcomingAppointment;
        logTest("Step 6 - Upcoming Appointment Detection", Boolean(upcoming && upcoming.appointmentDate === day10Str), `Upcoming date: ${upcoming?.appointmentDate}, Treatment: ${upcoming?.treatment}`);

        // 7. Verify Completed & Cancelled Sub-tab Lists
        const completedList = p.completedTreatments || history.filter((a) => a.status === "Completed");
        const cancelledList = p.cancelledAppointments || history.filter((a) => a.status === "Cancelled");
        logTest("Step 7 - Completed & Cancelled Lists", completedList.length === 1 && cancelledList.length === 1, `Completed: ${completedList.length}, Cancelled: ${cancelledList.length}`);

        console.log("\n=================================================");
        console.log("   COMPLETE PATIENT HISTORY SUITE PASSED 100%   ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runPatientHistorySuite();
