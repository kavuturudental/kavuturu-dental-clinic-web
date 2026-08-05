// src/services/doctorDashboardService.js

const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

const getLast7Days = () => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return start;
};

const getDashboardData = async () => {
    const { start, end } = getTodayRange();

    const [
        todayAppointments,
        confirmedToday,
        completedToday,
        cancelledToday,
        appointmentRequests,
        upcomingAppointments,
    ] = await Promise.all([
        Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end },
        }),

        Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end },
            status: "Confirmed",
        }),

        Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end },
            status: "Completed",
        }),

        Appointment.countDocuments({
            appointmentDate: { $gte: start, $lte: end },
            status: "Cancelled",
        }),

        Appointment.countDocuments({
            status: "Pending",
        }),

        Appointment.countDocuments({
            appointmentDate: { $gt: end },
        }),
    ]);

    const todaySchedule = await Appointment.find({
        appointmentDate: {
            $gte: start,
            $lte: end,
        },
    })
        .populate("patient", "name phone email")
        .sort({ appointmentTime: 1 })
        .lean();

    const recentRequests = await Appointment.find({
        status: "Pending",
    })
        .populate("patient", "name phone email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const recentPatients = await Patient.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const weeklyAppointments = await Appointment.aggregate([
        {
            $match: {
                appointmentDate: {
                    $gte: getLast7Days(),
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$appointmentDate",
                    },
                },
                total: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);

    const statusDistribution = await Appointment.aggregate([
        {
            $group: {
                _id: "$status",
                value: {
                    $sum: 1,
                },
            },
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                value: 1,
            },
        },
    ]);

    return {
        stats: {
            todayAppointments,
            confirmedToday,
            completedToday,
            cancelledToday,
            appointmentRequests,
            upcomingAppointments,
        },
        todaySchedule,
        recentRequests,
        recentPatients,
        weeklyAppointments,
        statusDistribution,
    };
};

module.exports = {
    getDashboardData,
};