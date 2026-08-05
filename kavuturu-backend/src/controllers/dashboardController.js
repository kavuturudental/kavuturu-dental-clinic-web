// src/controllers/dashboardController.js

const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");

/**
 * Helper to compute local start and end of day dates
 */
const getLocalDayBounds = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const startOfDay = new Date(year, month, date, 0, 0, 0, 0);
    const endOfDay = new Date(year, month, date, 23, 59, 59, 999);

    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(date).padStart(2, "0");
    const todayStr = `${year}-${mStr}-${dStr}`;

    return { startOfDay, endOfDay, todayStr, now };
};

/**
 * Convert time string (e.g. "09:30 AM") to minutes from midnight
 */
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

/**
 * Get Shared Dashboard & Appointment Summary Metrics
 * GET /api/dashboard/summary
 * GET /api/dashboard/appointment-summary
 */
const getDashboardSummary = async (req, res, next) => {
    try {
        const { startOfDay, endOfDay, todayStr, now } = getLocalDayBounds();

        // 1. Pending Requests (matches Appointment Requests queue)
        const pendingRequests = await AppointmentRequest.countDocuments({
            status: "Pending",
        });

        // 2. Today's Appointments: All scheduled for today except Rejected
        const todayAppointmentsList = await Appointment.find({
            status: { $ne: "Rejected" },
            $or: [
                { appointmentDate: { $gte: startOfDay, $lte: endOfDay } },
                { appointmentDate: todayStr },
            ],
        });

        const todaysAppointments = todayAppointmentsList.length;

        // 3. Completed & Cancelled count today
        const todayCompletedCount = todayAppointmentsList.filter(
            (a) => a.status === "Completed"
        ).length;

        const todayCancelledCount = todayAppointmentsList.filter(
            (a) => a.status === "Cancelled"
        ).length;

        // Formula: Today's Appointments minus Completed minus Cancelled
        const remainingToday = Math.max(0, todaysAppointments - todayCompletedCount - todayCancelledCount);

        // 4. Next Appointment for Today
        const remainingTodayApts = todayAppointmentsList.filter(
            (a) => a.status !== "Completed" && a.status !== "Cancelled"
        );

        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Sort by time ascending
        remainingTodayApts.sort((a, b) => {
            return parseTimeToMinutes(a.appointmentTime) - parseTimeToMinutes(b.appointmentTime);
        });

        let nextAptDoc = remainingTodayApts.find((a) => {
            if (["Checked In", "In Treatment", "Patient Arrived"].includes(a.status)) {
                return true;
            }
            return parseTimeToMinutes(a.appointmentTime) >= currentMinutes - 15;
        });

        if (!nextAptDoc && remainingTodayApts.length > 0) {
            nextAptDoc = remainingTodayApts[0];
        }

        const nextAppointment = nextAptDoc
            ? {
                  patientName: nextAptDoc.patientName,
                  time: nextAptDoc.appointmentTime,
              }
            : null;

        // Backward compatibility metrics
        const todaysSchedule = todaysAppointments;
        const upcomingAppointments = await Appointment.countDocuments({
            status: { $in: ["Confirmed", "Rescheduled"] },
            appointmentDate: { $gt: endOfDay },
        });

        const totalVisits = await Appointment.countDocuments({
            status: { $in: ["Confirmed", "Checked In", "Completed", "Rescheduled"] },
        });

        const completedVisits = await Appointment.countDocuments({
            status: "Completed",
        });

        return res.status(200).json({
            success: true,
            todaysAppointments,
            todaysSchedule,
            pendingRequests,
            pendingApprovals: pendingRequests,
            nextAppointment,
            remainingToday,
            upcomingAppointments,
            totalVisits,
            completedVisits,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardSummary,
    getAppointmentSummary: getDashboardSummary,
};