// src/controllers/insightsController.js

const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");
const Patient = require("../models/Patient");
const Notification = require("../models/Notification");

/**
 * Helper to compute date range filter object based on query range
 */
const getDateRangeFilter = (range, startDate, endDate) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let start = new Date(year, month, 1);
  let end = new Date(now.setHours(23, 59, 59, 999));
  let prevStart = new Date(year, month - 1, 1);
  let prevEnd = new Date(year, month, 0, 23, 59, 59, 999);

  if (range === "Today") {
    start = new Date(now.setHours(0, 0, 0, 0));
    end = new Date(now.setHours(23, 59, 59, 999));
    prevStart = new Date(now.getTime() - 86400000);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd = new Date(prevStart);
    prevEnd.setHours(23, 59, 59, 999);
  } else if (range === "This Week") {
    start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    prevStart = new Date(start);
    prevStart.setDate(start.getDate() - 7);
    prevEnd = new Date(start.getTime() - 1);
  } else if (range === "Last Month") {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 0, 23, 59, 59, 999);
    prevStart = new Date(year, month - 2, 1);
    prevEnd = new Date(year, month - 1, 0, 23, 59, 59, 999);
  } else if (range === "Last 6 Months") {
    start = new Date(year, month - 5, 1);
    prevStart = new Date(year, month - 11, 1);
    prevEnd = new Date(year, month - 5, 0, 23, 59, 59, 999);
  } else if (range === "Last Year" || range === "This Year") {
    start = new Date(year, 0, 1);
    prevStart = new Date(year - 1, 0, 1);
    prevEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
  } else if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    const duration = end.getTime() - start.getTime();
    prevEnd = new Date(start.getTime() - 1);
    prevStart = new Date(prevEnd.getTime() - duration);
  }

  return { start, end, prevStart, prevEnd };
};

/**
 * Get Comprehensive Insights & Analytics from Real MongoDB Data
 * GET /api/dashboard/insights
 * GET /api/doctor/appointment-management/insights
 */
const getInsights = async (req, res, next) => {
  try {
    const { range = "This Month", startDate, endDate, trendMonths = 6 } = req.query;
    const { start, end, prevStart, prevEnd } = getDateRangeFilter(range, startDate, endDate);

    const aptDateFilter = { appointmentDate: { $gte: start, $lte: end } };
    const patientDateFilter = { createdAt: { $gte: start, $lte: end } };
    const prevPatientDateFilter = { createdAt: { $gte: prevStart, $lte: prevEnd } };

    // ---------------------------------------------------------
    // SECTION 1: PATIENT INSIGHTS
    // ---------------------------------------------------------
    const totalPatients = await Patient.countDocuments();
    const newPatients = await Patient.countDocuments(patientDateFilter);
    const prevNewPatients = await Patient.countDocuments(prevPatientDateFilter);

    let patientGrowth = 0;
    if (prevNewPatients > 0) {
      patientGrowth = Math.round(((newPatients - prevNewPatients) / prevNewPatients) * 100 * 10) / 10;
    } else if (newPatients > 0) {
      patientGrowth = 100;
    }

    const returningPatientsRaw = await Appointment.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] } } },
      { $group: { _id: "$patient", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    const returningPatients = returningPatientsRaw.length;

    // ---------------------------------------------------------
    // SECTION 2: APPOINTMENT INSIGHTS
    // ---------------------------------------------------------
    const totalAppointments = await Appointment.countDocuments(aptDateFilter);
    const completed = await Appointment.countDocuments({ ...aptDateFilter, status: "Completed" });
    const cancelled = await Appointment.countDocuments({ ...aptDateFilter, status: "Cancelled" });
    const pending = await AppointmentRequest.countDocuments({ status: "Pending" });

    const completionRate = totalAppointments > 0
      ? Math.round((completed / totalAppointments) * 100 * 10) / 10
      : 0;

    // ---------------------------------------------------------
    // SECTION 3: MONTHLY TREND (Last 6 or 12 Months)
    // ---------------------------------------------------------
    const monthsLimit = parseInt(trendMonths) || 6;
    const trendStartDate = new Date();
    trendStartDate.setMonth(trendStartDate.getMonth() - (monthsLimit - 1));
    trendStartDate.setDate(1);
    trendStartDate.setHours(0, 0, 0, 0);

    const monthlyAptsRaw = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: trendStartDate },
          status: "Completed"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$appointmentDate" } },
          completedAppointments: { $sum: 1 }
        }
      }
    ]);

    const monthlyPatientsRaw = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: trendStartDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          newPatients: { $sum: 1 }
        }
      }
    ]);

    const monthMap = {};
    for (let i = monthsLimit - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const yr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${yr}-${mStr}`;
      const label = d.toLocaleDateString("default", { month: "short" });
      monthMap[key] = { month: label, newPatients: 0, completedAppointments: 0 };
    }

    monthlyAptsRaw.forEach((item) => {
      if (monthMap[item._id]) {
        monthMap[item._id].completedAppointments = item.completedAppointments;
      }
    });

    monthlyPatientsRaw.forEach((item) => {
      if (monthMap[item._id]) {
        monthMap[item._id].newPatients = item.newPatients;
      }
    });

    const monthlyTrend = Object.values(monthMap);

    // ---------------------------------------------------------
    // SECTION 4: MOST POPULAR TREATMENTS (Top 5)
    // ---------------------------------------------------------
    const treatmentDistRaw = await Appointment.aggregate([
      { $match: aptDateFilter },
      { $group: { _id: "$treatment", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const treatmentDistribution = treatmentDistRaw.map((t) => ({
      treatment: t._id || "General Checkup",
      count: t.count
    }));

    // If less than 5, fill from default list with 0
    const defaultTreatments = ["Laser Root Canal", "Dental Implants", "Teeth Whitening", "Braces & Aligners", "Smile Makeover"];
    defaultTreatments.forEach((dt) => {
      if (!treatmentDistribution.some((item) => item.treatment === dt) && treatmentDistribution.length < 5) {
        treatmentDistribution.push({ treatment: dt, count: 0 });
      }
    });

    // ---------------------------------------------------------
    // SECTION 5: APPOINTMENT STATUS DOUGHNUT CHART
    // ---------------------------------------------------------
    const statusDistRaw = await Appointment.aggregate([
      { $match: aptDateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusCounts = {
      Pending: pending,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      Rescheduled: 0
    };

    statusDistRaw.forEach((s) => {
      if (s._id in statusCounts) {
        statusCounts[s._id] = s.count;
      }
    });

    const appointmentStatus = Object.keys(statusCounts).map((key) => ({
      status: key,
      count: statusCounts[key]
    }));

    // ---------------------------------------------------------
    // SECTION 6: WEEKLY CLINIC ACTIVITY (Monday - Sunday)
    // ---------------------------------------------------------
    const weeklyRaw = await Appointment.aggregate([
      { $match: aptDateFilter },
      {
        $group: {
          _id: { $dayOfWeek: "$appointmentDate" }, // 1 = Sun, 2 = Mon, 3 = Tue, ...
          count: { $sum: 1 }
        }
      }
    ]);

    const dayNameMap = {
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
      1: "Sunday"
    };

    const weeklyCounts = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };

    weeklyRaw.forEach((w) => {
      const dayName = dayNameMap[w._id];
      if (dayName) {
        weeklyCounts[dayName] = w.count;
      }
    });

    const weeklyActivity = Object.keys(weeklyCounts).map((day) => ({
      day,
      count: weeklyCounts[day]
    }));

    // ---------------------------------------------------------
    // SECTION 7: RECENT CLINIC ACTIVITY LOG
    // ---------------------------------------------------------
    const rawNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(8);

    const recentActivity = rawNotifications.map((n) => ({
      id: n._id,
      type: n.type || "System Notification",
      title: n.title || n.type || "Activity",
      description: n.message || n.description || "",
      timeAgo: n.createdAt ? new Date(n.createdAt).toLocaleString() : "Recently"
    }));

    // Return unified payload
    return res.status(200).json({
      success: true,
      patientInsights: {
        newPatients,
        returningPatients,
        totalPatients,
        patientGrowth
      },
      appointmentInsights: {
        totalAppointments,
        completed,
        cancelled,
        pending,
        completionRate
      },
      monthlyTrend,
      treatmentDistribution,
      appointmentStatus,
      weeklyActivity,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsights
};
