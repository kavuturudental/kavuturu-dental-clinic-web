// src/controllers/appointmentController.js

const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Counter = require("../models/Counter");
const Notification = require("../models/Notification");

/**
 * Clean and format 10-digit Indian Mobile Number
 */
const cleanPhone = (rawPhone) => {
    if (!rawPhone) return "";
    let cleaned = String(rawPhone).replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith("91") && cleaned.length === 12) cleaned = cleaned.slice(2);
    else if (cleaned.startsWith("0") && cleaned.length === 11) cleaned = cleaned.slice(1);
    return cleaned.trim();
};

/**
 * Generate Sequential Appointment Number
 */
const generateAppointmentNumber = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "appointmentNumber" },
        { $inc: { sequence: 1 } },
        { returnDocument: "after", upsert: true }
    );
    return `KDC-${String(counter.sequence).padStart(6, "0")}`;
};

/**
 * Create Appointment (Internal Booking & Walk-ins)
 */
const createAppointment = async (req, res, next) => {
    try {
        const {
            name,
            patientName,
            phone,
            phoneNumber,
            email,
            treatment,
            appointmentDate,
            appointmentTime,
            bookingSource,
            source,
            message,
            notes,
            status
        } = req.body;

        const finalName = (patientName || name || "").trim();
        const rawPhone = String(phoneNumber || phone || "").trim();

        if (!rawPhone || rawPhone.length !== 10 || !/^\d{10}$/.test(rawPhone)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_PHONE",
                title: "Invalid Mobile Number",
                message: "Please enter a valid 10-digit mobile number.",
            });
        }

        const finalPhone = rawPhone;
        const finalEmail = (email || "").trim();
        const finalTreatment = (treatment || "General Checkup").trim();
        const finalDate = appointmentDate || req.body.date;
        const finalTime = appointmentTime || req.body.time || "10:00 AM";
        const sourceInput = bookingSource || source || "Receptionist";
        
        // Walk-in patients automatically set status = "Checked In"
        const isWalkIn = sourceInput === "Walk-in";
        const initialStatus = status || (isWalkIn ? "Checked In" : sourceInput === "Website" ? "Pending" : "Confirmed");
        const now = new Date();

        const cleanedPhone = cleanPhone(finalPhone);

        // 1. Strict Time Slot Double-Booking Validation (One 30-min slot = Max 1 Appointment)
        const AppointmentRequest = require("../models/AppointmentRequest");

        const existingAptSlot = await Appointment.findOne({
            appointmentDate: finalDate,
            appointmentTime: finalTime,
            status: { $nin: ["Cancelled", "No Show"] },
        });

        const existingReqSlot = await AppointmentRequest.findOne({
            preferredDate: finalDate,
            preferredTime: finalTime,
            status: { $nin: ["Rejected", "Cancelled"] },
        });

        if (existingAptSlot || existingReqSlot) {
            return res.status(400).json({
                success: false,
                message: "This time slot has already been booked. Please choose another available time.",
            });
        }

        // 2. Strict Same Patient Same Date Validation
        let existingPatientDoc = await Patient.findOne({ phone: cleanedPhone });

        const existingPatientApt = existingPatientDoc
            ? await Appointment.findOne({
                  patient: existingPatientDoc._id,
                  appointmentDate: finalDate,
                  status: { $nin: ["Cancelled", "No Show"] },
              })
            : null;

        const existingPatientReq = await AppointmentRequest.findOne({
            phone: { $regex: cleanedPhone, $options: "i" },
            preferredDate: finalDate,
            status: { $nin: ["Rejected", "Cancelled"] },
        });

        if (existingPatientApt || existingPatientReq) {
            return res.status(400).json({
                success: false,
                message: "You already have an appointment booked for this date. Please choose another day or contact the clinic if you need to reschedule.",
            });
        }

        let patient = await Patient.findOne({ phone: finalPhone });
        if (!patient && finalEmail) {
            patient = await Patient.findOne({ email: finalEmail });
        }

        if (!patient) {
            patient = await Patient.create({
                name: finalName,
                phone: finalPhone,
                email: finalEmail,
            });

            try {
                await Notification.create({
                    title: "New Patient Registered",
                    message: `New patient record created for ${finalName} (${finalPhone}).`,
                    type: "New Patient",
                    createdBy: req.user?._id || null,
                });
            } catch (nErr) {
                console.error("Failed to create patient notification:", nErr);
            }
        }

        const appointmentNumber = await generateAppointmentNumber();

        const appointment = await Appointment.create({
            patient: patient._id,
            appointmentNumber,
            appointmentDate: finalDate,
            appointmentTime: finalTime,
            treatment: finalTreatment,
            bookingSource: sourceInput,
            message: message || notes || "",
            status: initialStatus,
            checkedInAt: isWalkIn || initialStatus === "Checked In" ? now : null,
            createdBy: req.user?._id || null,
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate("patient")
            .populate("createdBy", "name email role");

        setTimeout(async () => {
            try {
                await Notification.create({
                    title: isWalkIn ? "Walk-in Patient Checked In" : "Appointment Booked",
                    message: isWalkIn
                        ? `Walk-in patient ${finalName} (${finalTreatment}) has been registered and checked in.`
                        : `New appointment ${appointmentNumber} booked for ${finalName} (${finalTreatment}) via ${sourceInput}.`,
                    type: isWalkIn ? "Patient Checked In" : "New Appointment Request",
                    createdBy: req.user?._id || null,
                });
            } catch (notifErr) {
                console.error("Async notification dispatch error:", notifErr);
            }
        }, 0);

        return res.status(201).json({
            success: true,
            message: isWalkIn
                ? `Walk-in patient ${finalName} registered and checked in successfully.`
                : `Appointment confirmed successfully via ${sourceInput}.`,
            data: populatedAppointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get All Appointments
 */
const getAppointments = async (req, res, next) => {
    try {
        const {
            search = "",
            status,
            date,
            page = 1,
            limit = 100,
        } = req.query;

        const query = {};

        if (status && status !== "All") {
            query.status = status;
        } else {
            query.status = { $ne: "Pending" };
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            query.appointmentDate = {
                $gte: start,
                $lt: end,
            };
        }

        let appointments = await Appointment.find(query)
            .populate("patient")
            .populate("createdBy", "name email role")
            .sort({
                appointmentDate: 1,
                appointmentTime: 1,
            });

        if (search) {
            const keyword = search.toLowerCase();

            appointments = appointments.filter((appointment) => {
                return (
                    (appointment.appointmentNumber && appointment.appointmentNumber.toLowerCase().includes(keyword)) ||
                    (appointment.treatment && appointment.treatment.toLowerCase().includes(keyword)) ||
                    (appointment.bookingSource && appointment.bookingSource.toLowerCase().includes(keyword)) ||
                    (appointment.patient?.name && appointment.patient.name.toLowerCase().includes(keyword)) ||
                    (appointment.patient?.phone && appointment.patient.phone.includes(search))
                );
            });
        }

        const total = appointments.length;
        const startIndex = (page - 1) * limit;
        const paginatedAppointments = appointments.slice(
            startIndex,
            startIndex + Number(limit)
        );

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)) || 1,
            count: paginatedAppointments.length,
            data: paginatedAppointments,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Appointment By ID
 */
const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate("patient")
            .populate("createdBy", "name email role");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Appointment Details
 */
const updateAppointment = async (req, res, next) => {
    try {
        const {
            appointmentDate,
            appointmentTime,
            treatment,
            message,
            bookingSource,
            status,
        } = req.body;

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        // Prevent editing Completed or Cancelled appointments
        if (appointment.status === "Completed" || appointment.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                code: "TERMINAL_STATUS_NO_EDIT",
                message: `Appointments with status "${appointment.status}" cannot be edited.`,
            });
        }

        // Prevent editing date/time for Checked In appointments
        const isCheckedIn = ["Checked In", "In Treatment", "Patient Arrived"].includes(appointment.status);
        const isDateChanged = appointmentDate && String(appointmentDate) !== String(appointment.appointmentDate);
        const isTimeChanged = appointmentTime && String(appointmentTime) !== String(appointment.appointmentTime);

        if (isCheckedIn && (isDateChanged || isTimeChanged)) {
            return res.status(400).json({
                success: false,
                code: "CHECKED_IN_NO_RESCHEDULE",
                message: "Checked-in appointments cannot be rescheduled. Please complete or cancel the appointment instead.",
            });
        }

        if (appointmentDate) appointment.appointmentDate = appointmentDate;
        if (appointmentTime) appointment.appointmentTime = appointmentTime;
        if (treatment) appointment.treatment = treatment;
        if (message !== undefined) appointment.message = message;
        if (bookingSource) appointment.bookingSource = bookingSource;
        if (status && status !== "Rescheduled") {
            appointment.status = status;
            const now = new Date();
            if (status === "Checked In") appointment.checkedInAt = now;
            else if (status === "Completed") appointment.completedAt = now;
            else if (status === "Cancelled") appointment.cancelledAt = now;
        }

        await appointment.save();

        const updatedAppointment = await Appointment.findById(appointment._id)
            .populate("patient")
            .populate("createdBy", "name email role");

        return res.status(200).json({
            success: true,
            message: "Appointment updated successfully.",
            data: updatedAppointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update Appointment Status (Lifecycle transitions)
 */
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required.",
            });
        }

        const appointment = await Appointment.findById(req.params.id).populate("patient");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        appointment.status = status;
        const now = new Date();

        if (status === "Checked In") {
            appointment.checkedInAt = now;
        } else if (status === "Completed") {
            appointment.completedAt = now;
        } else if (status === "Cancelled") {
            appointment.cancelledAt = now;
        } else if (status === "Rescheduled") {
            appointment.rescheduledAt = now;
        }

        await appointment.save();

        const patientName = appointment.patient?.name || "Patient";

        // Create Staff Notification for Lifecycle Change
        try {
            await Notification.create({
                title: status === "Checked In" ? "Patient Checked In" : `Appointment ${status}`,
                message: `Appointment ${appointment.appointmentNumber} for ${patientName} (${appointment.treatment}) is now ${status}.`,
                type: status === "Checked In" ? "Patient Checked In" : `Appointment ${status}`,
                createdBy: req.user?._id || null,
            });
        } catch (notifErr) {
            console.error("Failed to create status notification:", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel Appointment
 */
const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("patient");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        appointment.status = "Cancelled";
        appointment.cancelledAt = new Date();

        await appointment.save();

        const patientName = appointment.patient?.name || "Patient";

        // Create Staff Notification: "Appointment Cancelled"
        try {
            await Notification.create({
                title: "Appointment Cancelled",
                message: `Appointment ${appointment.appointmentNumber} for ${patientName} (${appointment.treatment}) has been cancelled.`,
                type: "Appointment Cancelled",
                createdBy: req.user?._id || null,
            });
        } catch (notifErr) {
            console.error("Failed to create cancellation notification:", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully.",
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete Appointment
 */
const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        await appointment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    deleteAppointment,
};