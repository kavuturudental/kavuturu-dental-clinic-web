// src/controllers/appointmentRequestController.js

const mongoose = require("mongoose");

const AppointmentRequest = require("../models/AppointmentRequest");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Counter = require("../models/Counter");
const Notification = require("../models/Notification");
const sendEmail = require("../services/emailService");

/**
 * Clean and format mobile number
 */
const cleanPhone = (rawPhone) => {
    if (!rawPhone) return "";
    let cleaned = String(rawPhone).replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith("91") && cleaned.length > 10) cleaned = cleaned.slice(2);
    else if (cleaned.startsWith("0") && cleaned.length > 10) cleaned = cleaned.slice(1);
    return cleaned.trim();
};

/**
 * @desc    Create Appointment Request (Website Public Booking)
 * @route   POST /api/appointment-requests
 * @access  Public
 */
const VALID_TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
];

/**
 * @desc    Create Appointment Request (Website Public Booking)
 * @route   POST /api/appointment-requests
 * @access  Public
 */
const createAppointmentRequest = async (req, res, next) => {
    try {
        const {
            patientName,
            name,
            fullName,
            phone,
            phoneNumber,
            email,
            treatment,
            preferredDate,
            appointmentDate,
            date,
            preferredTime,
            appointmentTime,
            timeSlot,
            time,
            message,
            bookingSource,
            source,
        } = req.body;

        const finalName = (patientName || fullName || name || "").trim();
        const finalPhone = (phone || phoneNumber || "").trim();
        const finalEmail = (email || "").trim();
        const finalTreatment = (treatment || "").trim();
        const rawDate = (preferredDate || appointmentDate || date || "").trim();
        const rawTime = (preferredTime || appointmentTime || timeSlot || time || "").trim();

        // -------------------------------------------------------------
        // Rule 7 – Required Fields Validation
        // -------------------------------------------------------------
        if (!finalName || !finalPhone || !finalEmail || !finalTreatment || !rawDate || !rawTime) {
            return res.status(400).json({
                success: false,
                code: "REQUIRED_FIELDS_MISSING",
                title: "Incomplete Form",
                message: "Please fill in all required fields (Name, Phone Number, Email, Treatment, Date, and Time).",
            });
        }

        // -------------------------------------------------------------
        // Rule 8 – Invalid Data Format Validations (Email & Phone)
        // -------------------------------------------------------------
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(finalEmail)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_EMAIL",
                title: "Invalid Email Address",
                message: "Please enter a valid email address.",
            });
        }

        if (!finalPhone || finalPhone.length !== 10 || !/^\d{10}$/.test(finalPhone)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_PHONE",
                title: "Invalid Mobile Number",
                message: "Please enter a valid 10-digit mobile number.",
            });
        }

        let cleanedPhone = finalPhone;

        // Standardize Date string to YYYY-MM-DD
        let formattedDateStr = rawDate;
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
            const y = parsedDate.getFullYear();
            const m = String(parsedDate.getMonth() + 1).padStart(2, "0");
            const d = String(parsedDate.getDate()).padStart(2, "0");
            formattedDateStr = `${y}-${m}-${d}`;
        }

        // -------------------------------------------------------------
        // Rule 4 – Past Date Validation
        // -------------------------------------------------------------
        const todayObj = new Date();
        const todayY = todayObj.getFullYear();
        const todayM = String(todayObj.getMonth() + 1).padStart(2, "0");
        const todayD = String(todayObj.getDate()).padStart(2, "0");
        const todayStr = `${todayY}-${todayM}-${todayD}`;

        if (formattedDateStr < todayStr) {
            return res.status(400).json({
                success: false,
                code: "INVALID_DATE",
                title: "Invalid Appointment Date",
                message: "Appointments cannot be booked for past dates. Please select today or a future date.",
            });
        }

        // -------------------------------------------------------------
        // Rule 5 – Working Hours Validation
        // -------------------------------------------------------------
        if (!VALID_TIME_SLOTS.includes(rawTime)) {
            return res.status(400).json({
                success: false,
                code: "INVALID_TIME",
                title: "Invalid Appointment Time",
                message: "Appointments can only be scheduled during clinic working hours. Please select a valid time slot.",
            });
        }

        // Standardize Date range for MongoDB Date field matching
        const startOfDay = new Date(`${formattedDateStr}T00:00:00.000Z`);
        const endOfDay = new Date(`${formattedDateStr}T23:59:59.999Z`);
        const dateMatchQuery = { $gte: startOfDay, $lte: endOfDay };

        // -------------------------------------------------------------
        // Rule 3 – Duplicate Appointment (Same Name, Phone, Date, Time)
        // -------------------------------------------------------------
        const existingDuplicateReq = await AppointmentRequest.findOne({
            patientName: { $regex: `^${finalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: "i" },
            phone: { $regex: cleanedPhone, $options: "i" },
            preferredDate: dateMatchQuery,
            preferredTime: rawTime,
            status: { $nin: ["Rejected", "Cancelled"] },
        });

        let existingDuplicateApt = null;
        const matchingPatients = await Patient.find({ phone: { $regex: cleanedPhone, $options: "i" } });
        if (matchingPatients.length > 0) {
            const patientIds = matchingPatients.map((p) => p._id);
            existingDuplicateApt = await Appointment.findOne({
                patient: { $in: patientIds },
                appointmentDate: dateMatchQuery,
                appointmentTime: rawTime,
                status: { $nin: ["Cancelled", "No Show"] },
            });
        }

        if (existingDuplicateReq || existingDuplicateApt) {
            return res.status(400).json({
                success: false,
                code: "DUPLICATE_APPOINTMENT",
                title: "Duplicate Appointment",
                message: "This appointment has already been submitted. Please check your existing booking or contact the clinic if you need assistance.",
            });
        }

        // -------------------------------------------------------------
        // Rule 2 – One Appointment Per Patient Per Day (Same Phone & Date)
        // -------------------------------------------------------------
        const existingPatientReq = await AppointmentRequest.findOne({
            phone: { $regex: cleanedPhone, $options: "i" },
            preferredDate: dateMatchQuery,
            status: { $nin: ["Rejected", "Cancelled"] },
        });

        let existingPatientApt = null;
        if (matchingPatients.length > 0) {
            const patientIds = matchingPatients.map((p) => p._id);
            existingPatientApt = await Appointment.findOne({
                patient: { $in: patientIds },
                appointmentDate: dateMatchQuery,
                status: { $nin: ["Cancelled", "No Show"] },
            });
        }

        if (existingPatientReq || existingPatientApt) {
            return res.status(400).json({
                success: false,
                code: "PATIENT_DAILY_LIMIT",
                title: "Appointment Already Exists",
                message: "You already have an appointment scheduled for this date. Only one appointment can be booked per day. Please choose another date or contact the clinic if you need to reschedule.",
            });
        }

        // -------------------------------------------------------------
        // Rule 1 – One Time Slot = One Appointment (Same Date & Time)
        // -------------------------------------------------------------
        const existingAptSlot = await Appointment.findOne({
            appointmentDate: dateMatchQuery,
            appointmentTime: rawTime,
            status: { $nin: ["Cancelled", "No Show"] },
        });

        const existingReqSlot = await AppointmentRequest.findOne({
            preferredDate: dateMatchQuery,
            preferredTime: rawTime,
            status: { $nin: ["Rejected", "Cancelled"] },
        });

        if (existingAptSlot || existingReqSlot) {
            return res.status(400).json({
                success: false,
                code: "SLOT_UNAVAILABLE",
                title: "Time Slot Unavailable",
                message: "This appointment slot has already been booked by another patient. Please select another available time.",
            });
        }

        // -------------------------------------------------------------
        // Rule 10 – Save to MongoDB (Status = Pending) & Create Notification
        // -------------------------------------------------------------
        try {
            let patient = await Patient.findOne({
                $or: [
                    { phone: finalPhone },
                    { phone: cleanedPhone }
                ]
            });

            if (!patient) {
                patient = await Patient.create({
                    name: finalName,
                    phone: finalPhone,
                    email: finalEmail || "",
                });
            } else {
                if (finalName && finalName !== "Patient") patient.name = finalName;
                if (finalEmail && finalEmail.trim() !== "") patient.email = finalEmail;
                await patient.save();
            }
        } catch (patientErr) {
            console.error("Patient profile save warning:", patientErr.message);
        }

        const request = await AppointmentRequest.create({
            patientName: finalName,
            phone: finalPhone,
            email: finalEmail,
            treatment: finalTreatment,
            preferredDate: formattedDateStr,
            preferredTime: rawTime,
            message: message || "",
            bookingSource: bookingSource || source || "Website",
            status: "Pending",
        });

        // Create Staff Notification
        try {
            const formattedDateDisplay = new Date(formattedDateStr).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            await Notification.create({
                title: "New Appointment Request",
                message: `New booking request from ${finalName} for ${finalTreatment} on ${formattedDateDisplay} at ${rawTime}.`,
                type: "New Appointment Request",
            });
        } catch (notifErr) {
            console.error("Failed to create staff notification:", notifErr);
        }

        return res.status(201).json({
            success: true,
            message: "Appointment request submitted successfully.",
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get All Appointment Requests (Returns Pending requests by default)
 * @route   GET /api/appointment-requests
 * @access  Private
 */
const getAppointmentRequests = async (req, res, next) => {
    try {
        const {
            search = "",
            status,
            page = 1,
            limit = 100,
        } = req.query;

        const query = {};

        if (status && status !== "All") {
            query.status = status;
        } else if (!status) {
            query.status = "Pending";
        }

        let requests = await AppointmentRequest.find(query)
            .populate("reviewedBy", "name email role")
            .sort({
                createdAt: -1,
            });

        if (search) {
            const keyword = search.toLowerCase();

            requests = requests.filter((request) => {
                return (
                    (request.patientName && request.patientName.toLowerCase().includes(keyword)) ||
                    (request.phone && request.phone.includes(search)) ||
                    (request.treatment && request.treatment.toLowerCase().includes(keyword))
                );
            });
        }

        const total = requests.length;
        const startIndex = (page - 1) * Number(limit);
        const paginatedRequests = requests.slice(
            startIndex,
            startIndex + Number(limit)
        );

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)) || 1,
            count: paginatedRequests.length,
            data: paginatedRequests,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Appointment Request By ID
 * @route   GET /api/appointment-requests/:id
 * @access  Private
 */
const getAppointmentRequestById = async (req, res, next) => {
    try {
        const request = await AppointmentRequest.findById(
            req.params.id
        ).populate("reviewedBy", "name email role");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Appointment request not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Helper to generate unique appointment number
 */
const generateAppointmentNumber = async () => {
    try {
        let counter = await Counter.findById("appointmentNumber");
        if (!counter) {
            counter = await Counter.create({ _id: "appointmentNumber", seq: 1000 });
        }
        const nextSeq = counter.seq + 1;
        counter.seq = nextSeq;
        await counter.save();
        return `APT-${nextSeq}`;
    } catch (err) {
        return `APT-${Date.now().toString().slice(-4)}`;
    }
};

/**
 * @desc    Accept / Approve Appointment Request
 * @route   PUT /api/appointment-requests/:id/accept
 * @route   PATCH /api/appointment-requests/:id/approve
 * @access  Private
 */
const acceptAppointmentRequest = async (req, res, next) => {
    try {
        const id = req.params.id;

        let request = await AppointmentRequest.findById(id);
        let appointment = await Appointment.findById(id).populate("patient");

        if (!request && !appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment request or appointment not found.",
            });
        }

        if (request && request.status === "Accepted" && appointment && appointment.status === "Confirmed") {
            return res.status(400).json({
                success: false,
                message: "Appointment request is already accepted.",
            });
        }

        const patientName = request ? request.patientName : appointment.patient?.name;
        const phone = request ? request.phone : appointment.patient?.phone;
        const email = request ? request.email : appointment.patient?.email;
        const treatment = request ? request.treatment : appointment.treatment;
        const preferredDate = request ? request.preferredDate : appointment.appointmentDate;
        const preferredTime = request ? request.preferredTime : appointment.appointmentTime;
        const bookingSource = request ? request.bookingSource : appointment.bookingSource;

        // Ensure Patient record exists
        let patient = appointment?.patient;
        if (!patient && phone) {
            let cleanedPhone = String(phone).replace(/[\s\-\(\)]/g, "");
            if (cleanedPhone.startsWith("+91")) cleanedPhone = cleanedPhone.slice(3);
            else if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) cleanedPhone = cleanedPhone.slice(2);
            else if (cleanedPhone.startsWith("0") && cleanedPhone.length > 10) cleanedPhone = cleanedPhone.slice(1);

            patient = await Patient.findOne({
                $or: [
                    { phone: cleanedPhone || phone },
                    { email: email && email.trim() !== "" ? email : "non-existing-email" }
                ],
            });
            if (!patient) {
                patient = await Patient.create({
                    name: patientName || "Patient",
                    phone: cleanedPhone || phone || "",
                    email: email || "",
                });
            }
        }

        if (!appointment) {
            const appointmentNumber = await generateAppointmentNumber();
            appointment = await Appointment.create({
                patient: patient._id,
                appointmentNumber,
                appointmentDate: preferredDate,
                appointmentTime: preferredTime,
                treatment,
                bookingSource: bookingSource || "Website",
                message: request?.message || "",
                status: "Confirmed",
                createdBy: req.user?._id || null,
            });
        } else {
            appointment.status = "Confirmed";
            if (patient) appointment.patient = patient._id;
            await appointment.save();
        }

        if (request) {
            request = await AppointmentRequest.findByIdAndUpdate(
                id,
                {
                    status: "Accepted",
                    reviewedBy: req.user?._id || null,
                    reviewedAt: new Date(),
                },
                { new: true }
            );
        }

        const updatedAppointment = await Appointment.findById(appointment._id).populate("patient");

        // Non-blocking notification
        setTimeout(async () => {
            try {
                await Notification.create({
                    title: "Appointment Approved",
                    message: `Appointment for ${patientName} (${treatment}) on ${new Date(preferredDate).toLocaleDateString()} at ${preferredTime} has been approved and confirmed.`,
                    type: "Appointment Approved",
                    createdBy: req.user?._id || null,
                });
            } catch (err) {
                console.error("Async notification error:", err.message);
            }
        }, 0);

        return res.status(200).json({
            success: true,
            message: "Appointment request approved and confirmed successfully.",
            data: {
                request,
                appointment: updatedAppointment,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject Appointment Request
 * @route   PUT /api/appointment-requests/:id/reject
 * @access  Private
 */
const rejectAppointmentRequest = async (req, res, next) => {
    try {
        let request = await AppointmentRequest.findById(req.params.id);
        let appointment = null;

        if (!request) {
            appointment = await Appointment.findById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment request not found.",
                });
            }
        }

        if (request) {
            request.status = "Rejected";
            request.reviewedBy = req.user?._id || null;
            request.reviewedAt = new Date();
            await request.save();
        }

        if (appointment) {
            appointment.status = "Cancelled";
            await appointment.save();
        }

        const patientName = request ? request.patientName : "Patient";
        const treatment = request ? request.treatment : appointment?.treatment || "";

        // Staff Notification: "Appointment Request Rejected"
        try {
            await Notification.create({
                title: "Appointment Request Rejected",
                message: `Appointment request for ${patientName} (${treatment}) was rejected.`,
                type: "Appointment Request Rejected",
                createdBy: req.user?._id || null,
            });
        } catch (notifErr) {
            console.error("Failed to create rejection notification:", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Appointment request rejected successfully.",
            data: request || appointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reschedule Appointment Request
 * @route   PUT /api/appointment-requests/:id/reschedule
 * @access  Private
 */
const rescheduleAppointmentRequest = async (req, res, next) => {
    try {
        const {
            preferredDate,
            preferredTime,
            date,
            time
        } = req.body;

        const newDate = preferredDate || date;
        const newTime = preferredTime || time;

        let request = await AppointmentRequest.findById(req.params.id);
        let appointment = null;

        if (!request) {
            appointment = await Appointment.findById(req.params.id);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment request not found.",
                });
            }
        }

        if (request) {
            if (newDate) request.preferredDate = newDate;
            if (newTime) request.preferredTime = newTime;
            request.status = "Rescheduled";
            request.reviewedBy = req.user?._id || null;
            request.reviewedAt = new Date();
            await request.save();
        }

        if (appointment) {
            if (newDate) appointment.appointmentDate = newDate;
            if (newTime) appointment.appointmentTime = newTime;
            appointment.status = "Confirmed";
            await appointment.save();
        }

        const patientName = request ? request.patientName : "Patient";

        // Staff Notification: "Appointment Rescheduled"
        try {
            await Notification.create({
                title: "Appointment Rescheduled",
                message: `Appointment request for ${patientName} was rescheduled to ${newDate} at ${newTime}.`,
                type: "Appointment Rescheduled",
                createdBy: req.user?._id || null,
            });
        } catch (notifErr) {
            console.error("Failed to create reschedule notification:", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Appointment request rescheduled successfully.",
            data: request || appointment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Booked Time Slots for a specific date (Public & Internal)
 * @route   GET /api/appointment-requests/booked-slots
 * @access  Public
 */
const getBookedSlots = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(200).json({
                success: true,
                date: "",
                bookedSlots: [],
            });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const dateMatchQuery = { $gte: startOfDay, $lte: endOfDay };

        // Query active appointments for the date
        const bookedAppointments = await Appointment.find({
            $or: [{ appointmentDate: date }, { appointmentDate: dateMatchQuery }],
            status: { $nin: ["Cancelled", "No Show"] },
        }).select("appointmentTime");

        // Query active pending/approved requests for the date
        const bookedRequests = await AppointmentRequest.find({
            $or: [{ preferredDate: date }, { preferredDate: dateMatchQuery }],
            status: { $nin: ["Rejected", "Cancelled"] },
        }).select("preferredTime");

        const slotsSet = new Set();

        bookedAppointments.forEach((apt) => {
            if (apt.appointmentTime) slotsSet.add(apt.appointmentTime.trim());
        });

        bookedRequests.forEach((reqItem) => {
            if (reqItem.preferredTime) slotsSet.add(reqItem.preferredTime.trim());
        });

        return res.status(200).json({
            success: true,
            date,
            bookedSlots: Array.from(slotsSet),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointmentRequest,
    getAppointmentRequests,
    getAppointmentRequestById,
    acceptAppointmentRequest,
    rejectAppointmentRequest,
    rescheduleAppointmentRequest,
    getBookedSlots,
};