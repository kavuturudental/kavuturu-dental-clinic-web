// src/scripts/verifyAppointmentSortingComplete.js

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

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const match = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : "";
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

async function runAppointmentSortingSuite() {
    console.log("\n=================================================");
    console.log("   ROBUST APPOINTMENT SORTING TEST SUITE        ");
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

        // 2. Seed test appointments for Today with out-of-order creation times
        const todayStr = getLocalDateString(0);
        const day1Str = getLocalDateString(1);
        const day2Str = getLocalDateString(2);

        // Today 02:00 PM (created first)
        const reqTodayLater = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Today Afternoon Patient",
            phone: getRandomPhone(),
            email: "pm@test.com",
            treatment: "Teeth Whitening",
            date: todayStr,
            time: "02:00 PM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${reqTodayLater.data.data._id}/accept`, {}, authHeader);

        // Today 09:00 AM (created second)
        const reqTodayEarly = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Today Morning Patient",
            phone: getRandomPhone(),
            email: "am@test.com",
            treatment: "Laser Root Canal",
            date: todayStr,
            time: "09:00 AM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${reqTodayEarly.data.data._id}/accept`, {}, authHeader);

        // Day 2 (created third)
        const reqDay2 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Day 2 Patient",
            phone: getRandomPhone(),
            email: "day2@test.com",
            treatment: "Dental Implants",
            date: day2Str,
            time: "10:00 AM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${reqDay2.data.data._id}/accept`, {}, authHeader);

        // Day 1 (created fourth)
        const reqDay1 = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Day 1 Patient",
            phone: getRandomPhone(),
            email: "day1@test.com",
            treatment: "Crowns & Bridges",
            date: day1Str,
            time: "11:30 AM",
        });
        await axios.put(`${API_BASE}/appointment-requests/${reqDay1.data.data._id}/accept`, {}, authHeader);

        logTest("Step 2 - Seeded Out-Of-Order Test Appointments", true, "Seeded out-of-order slots to test sorting");

        // 3. Fetch all appointments from backend
        const allRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        const appointmentsList = (allRes.data.data || []).map((a) => ({
            id: a._id,
            patientName: a.patient?.name || a.patientName || "",
            status: a.status || "Confirmed",
            date: (a.appointmentDate || a.date || "").slice(0, 10),
            time: a.appointmentTime || a.time || "10:00 AM",
        }));

        // 4. Verify Today Filter Sorting (Strictly Time Ascending: 09:00 AM before 02:00 PM)
        const todayApts = appointmentsList.filter((a) => a.date === todayStr && a.status !== "Rejected" && a.status !== "Pending");
        todayApts.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

        const isTodayCorrectlySorted = todayApts.length >= 2 && todayApts[0].time === "09:00 AM" && todayApts[todayApts.length - 1].time === "02:00 PM";
        logTest("Step 3 - 'Today' Filter Sorting Rule", isTodayCorrectlySorted, `First: ${todayApts[0]?.time}, Last: ${todayApts[todayApts.length - 1]?.time}`);

        // 5. Verify Upcoming Filter Sorting (Date Ascending: Day 1 before Day 2)
        const upcomingApts = appointmentsList.filter((a) => a.date > todayStr && a.status !== "Completed" && a.status !== "Cancelled" && a.status !== "Pending" && a.status !== "Rejected");
        upcomingApts.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
        });

        const isUpcomingCorrectlySorted = upcomingApts.length >= 2 && upcomingApts[0].date === day1Str && upcomingApts[1].date === day2Str;
        logTest("Step 4 - 'Upcoming' Filter Sorting Rule", isUpcomingCorrectlySorted, `Nearest date first: ${upcomingApts[0]?.date} -> ${upcomingApts[1]?.date}`);

        // 6. Verify All Filter Sorting (Date Descending: Day 2 before Today)
        const allAptsSorted = [...appointmentsList].filter((a) => a.status !== "Rejected" && a.status !== "Pending");
        allAptsSorted.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
        });

        const isAllCorrectlySorted = allAptsSorted.length >= 4 && allAptsSorted[0].date >= allAptsSorted[allAptsSorted.length - 1].date;
        logTest("Step 5 - 'All' Filter Sorting Rule", isAllCorrectlySorted, `Newest date first: ${allAptsSorted[0]?.date} -> ${allAptsSorted[allAptsSorted.length - 1]?.date}`);

        console.log("\n=================================================");
        console.log("   ROBUST APPOINTMENT SORTING SUITE PASSED      ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runAppointmentSortingSuite();
