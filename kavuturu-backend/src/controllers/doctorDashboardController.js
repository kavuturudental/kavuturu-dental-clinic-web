// src/controllers/doctorDashboardController.js

const doctorDashboardService = require("../services/doctorDashboardService");

/**
 * @desc    Get Doctor Dashboard Data
 * @route   GET /api/doctor/dashboard
 * @access  Private (Doctor)
 */
const getDoctorDashboard = async (req, res, next) => {
    try {
        const dashboardData = await doctorDashboardService.getDashboardData();

        return res.status(200).json({
            success: true,
            message: "Doctor dashboard fetched successfully.",
            data: dashboardData,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDoctorDashboard,
};