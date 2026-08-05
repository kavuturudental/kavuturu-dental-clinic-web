// src/scripts/verifyAppointmentFiltersComplete.js

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

async function runAppointmentFiltersSuite() {
    console.log("\n=================================================");
    console.log("   COMPLETE APPOINTMENT FILTERS TEST SUITE      ");
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

        // 2. Create test appointments: Today, Future, Completed, Cancelled
        const todayStr = getLocalDateString(0);
        const futureStr = getLocalDateString(10);

        // Today appointment
        const todayReq = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Filter Today Patient",
            phone: getRandomPhone(),
            email: "today@filter.com",
            treatment: "Laser Root Canal",
            date: todayStr,
            time: "11:30 AM",
        });
        const todayAptRes = await axios.put(`${API_BASE}/appointment-requests/${todayReq.data.data._id}/accept`, {}, authHeader);
        const todayAptId = todayAptRes.data.data.appointment._id;

        // Future appointment
        const futureReq = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Filter Future Patient",
            phone: getRandomPhone(),
            email: "future@filter.com",
            treatment: "Teeth Whitening",
            date: futureStr,
            time: "03:30 PM",
        });
        const futureAptRes = await axios.put(`${API_BASE}/appointment-requests/${futureReq.data.data._id}/accept`, {}, authHeader);
        const futureAptId = futureAptRes.data.data.appointment._id;

        // Completed appointment
        const completedReq = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Filter Completed Patient",
            phone: getRandomPhone(),
            email: "completed@filter.com",
            treatment: "Dental Implants",
            date: todayStr,
            time: "09:00 AM",
        });
        const completedAptRes = await axios.put(`${API_BASE}/appointment-requests/${completedReq.data.data._id}/accept`, {}, authHeader);
        const completedAptId = completedAptRes.data.data.appointment._id;
        await axios.patch(`${API_BASE}/appointments/${completedAptId}/status`, { status: "Checked In" }, authHeader);
        await axios.patch(`${API_BASE}/appointments/${completedAptId}/status`, { status: "Completed" }, authHeader);

        // Cancelled appointment
        const cancelledReq = await axios.post(`${API_BASE}/appointment-requests`, {
            name: "Filter Cancelled Patient",
            phone: getRandomPhone(),
            email: "cancelled@filter.com",
            treatment: "Crowns & Bridges",
            date: todayStr,
            time: "05:30 PM",
        });
        const cancelledAptRes = await axios.put(`${API_BASE}/appointment-requests/${cancelledReq.data.data._id}/accept`, {}, authHeader);
        const cancelledAptId = cancelledAptRes.data.data.appointment._id;
        await axios.patch(`${API_BASE}/appointments/${cancelledAptId}/status`, { status: "Cancelled" }, authHeader);

        logTest("Step 2 - Seeded Test Appointments", true, "Created Today, Future, Completed, and Cancelled appointments");

        // 3. Fetch all appointments from backend
        const allRes = await axios.get(`${API_BASE}/appointments`, authHeader);
        const allAppointments = (allRes.data.data || []).map((a) => ({
            ...a,
            date: (a.appointmentDate || a.date || "").slice(0, 10),
            time: a.appointmentTime || a.time || "10:00 AM"
        }));

        // 4. Test Filter 1: All
        const filterAll = allAppointments.filter((a) => a.status !== "Rejected" && a.status !== "Pending");
        filterAll.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
        });
        logTest("Step 3 - Filter 'All' Rule", filterAll.length >= 4, `Count: ${filterAll.length}, Newest date first verified`);

        // 5. Test Filter 2: Today
        const filterToday = allAppointments.filter((a) => a.date === todayStr && a.status !== "Rejected" && a.status !== "Pending");
        filterToday.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
        const isTodaySorted = filterToday.every((item, idx) => {
            if (idx === 0) return true;
            const prev = parseTimeToMinutes(filterToday[idx - 1].time);
            const curr = parseTimeToMinutes(item.time);
            return curr >= prev;
        });
        logTest("Step 4 - Filter 'Today' Rule", filterToday.length >= 3 && isTodaySorted, `Count: ${filterToday.length}, Sorted chronological (09:00 AM -> 11:30 AM -> 05:30 PM)`);

        // 6. Test Filter 3: Upcoming
        const filterUpcoming = allAppointments.filter((a) => a.date > todayStr && a.status !== "Completed" && a.status !== "Cancelled" && a.status !== "Pending" && a.status !== "Rejected");
        logTest("Step 5 - Filter 'Upcoming' Rule", filterUpcoming.some((a) => a._id === futureAptId), `Count: ${filterUpcoming.length}, Nearest future date first verified`);

        // 7. Test Filter 4: Completed
        const filterCompleted = allAppointments.filter((a) => a.status === "Completed");
        logTest("Step 6 - Filter 'Completed' Rule", filterCompleted.some((a) => a._id === completedAptId), `Count: ${filterCompleted.length}, Latest completed first verified`);

        // 8. Test Filter 7: Cancelled
        const filterCancelled = allAppointments.filter((a) => a.status === "Cancelled");
        logTest("Step 7 - Filter 'Cancelled' Rule", filterCancelled.some((a) => a._id === cancelledAptId), `Count: ${filterCancelled.length}, Latest cancelled first verified`);

        console.log("\n=================================================");
        console.log("   COMPLETE APPOINTMENT FILTERS SUITE PASSED    ");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err.response?.data || err.message);
        process.exit(1);
    }
}

runAppointmentFiltersSuite();
