// src/controllers/patientController.js

const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const AppointmentRequest = require("../models/AppointmentRequest");

/**
 * Clean and format mobile number for 10-digit comparison
 */
const cleanPhoneHelper = (rawPhone) => {
    if (!rawPhone) return "";
    let cleaned = String(rawPhone).replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
    else if (cleaned.startsWith("91") && cleaned.length > 10) cleaned = cleaned.slice(2);
    else if (cleaned.startsWith("0") && cleaned.length > 10) cleaned = cleaned.slice(1);
    return cleaned.trim();
};

const formatYmd = (rawDate) => {
    if (!rawDate) return "";
    if (typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
        return rawDate.slice(0, 10);
    }
    try {
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return "";
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    } catch {
        return "";
    }
};

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
 * Helper to compute patient appointment metrics and full history
 */
const getPatientAppointmentData = async (patientDoc) => {
    const cleanedPhone = cleanPhoneHelper(patientDoc.phone);

    // Fetch appointments linked via patient ID or phone
    const mongoApts = await Appointment.find({
        $or: [
            { patient: patientDoc._id },
            ...(cleanedPhone ? [{ phone: { $regex: cleanedPhone, $options: "i" } }] : []),
            ...(patientDoc.phone ? [{ phone: patientDoc.phone }] : [])
        ]
    }).lean();

    // Fetch requests linked via phone (excluding Accepted ones which already exist as Appointments)
    const mongoReqs = await AppointmentRequest.find({
        status: { $ne: "Accepted" },
        ...(cleanedPhone ? { phone: { $regex: cleanedPhone, $options: "i" } } : { phone: patientDoc.phone })
    }).lean();

    // Combine and deduplicate if same _id exists in both
    const aptMap = new Map();

    mongoApts.forEach(apt => {
        const idStr = String(apt._id);
        const dateStr = formatYmd(apt.appointmentDate || apt.date);
        aptMap.set(idStr, {
            _id: apt._id,
            id: apt._id,
            appointmentNumber: apt.appointmentNumber || `APT-${String(apt._id).slice(-4).toUpperCase()}`,
            appointmentDate: dateStr,
            date: dateStr,
            appointmentTime: apt.appointmentTime || "10:00 AM",
            time: apt.appointmentTime || "10:00 AM",
            treatment: apt.treatment || "General Consultation",
            status: apt.status || "Confirmed",
            doctor: apt.doctor || "Dr. K. Ravindra Babu",
            bookingSource: apt.bookingSource || "Website",
            message: apt.message || "",
            createdAt: apt.createdAt || new Date(),
        });
    });

    mongoReqs.forEach(req => {
        const idStr = String(req._id);
        if (!aptMap.has(idStr)) {
            const dateStr = formatYmd(req.preferredDate || req.date);
            aptMap.set(idStr, {
                _id: req._id,
                id: req._id,
                appointmentNumber: `REQ-${String(req._id).slice(-4).toUpperCase()}`,
                appointmentDate: dateStr,
                date: dateStr,
                appointmentTime: req.preferredTime || "10:00 AM",
                time: req.preferredTime || "10:00 AM",
                treatment: req.treatment || "General Consultation",
                status: req.status === "Accepted" ? "Confirmed" : (req.status || "Pending"),
                doctor: "Dr. K. Ravindra Babu",
                bookingSource: req.bookingSource || "Website",
                message: req.message || "",
                createdAt: req.createdAt || new Date(),
            });
        }
    });

    const allHistory = Array.from(aptMap.values());

    // Sort newest first: Appointment Date desc, then Appointment Time desc
    allHistory.sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
            return b.appointmentDate.localeCompare(a.appointmentDate);
        }
        return parseTimeToMinutes(b.appointmentTime || b.time) - parseTimeToMinutes(a.appointmentTime || a.time);
    });

    const totalVisits = allHistory.length;
    const dNow = new Date();
    const todayStr = `${dNow.getFullYear()}-${String(dNow.getMonth() + 1).padStart(2, "0")}-${String(dNow.getDate()).padStart(2, "0")}`;

    // First Visit Date (earliest date in history)
    let firstVisitDate = "";
    if (allHistory.length > 0) {
        const sortedOldestFirst = [...allHistory].sort((a, b) => {
            if (a.appointmentDate !== b.appointmentDate) return a.appointmentDate.localeCompare(b.appointmentDate);
            return parseTimeToMinutes(a.appointmentTime || a.time) - parseTimeToMinutes(b.appointmentTime || b.time);
        });
        firstVisitDate = sortedOldestFirst[0].appointmentDate;
    }

    // Latest Appointment Date & Current Status (from newest appointment)
    const latestApt = allHistory.length > 0 ? allHistory[0] : null;
    const latestAppointmentDate = latestApt ? latestApt.appointmentDate : "";
    const currentStatus = latestApt ? latestApt.status : "Pending";

    // Upcoming Appointment: Date >= today & status != Cancelled & status != Completed & status != Rejected
    const upcomingApts = allHistory
        .filter(a => a.appointmentDate >= todayStr && a.status !== "Cancelled" && a.status !== "Completed" && a.status !== "Rejected")
        .sort((a, b) => {
            if (a.appointmentDate !== b.appointmentDate) return a.appointmentDate.localeCompare(b.appointmentDate);
            return parseTimeToMinutes(a.appointmentTime || a.time) - parseTimeToMinutes(b.appointmentTime || b.time);
        });
    const upcomingAppointment = upcomingApts.length > 0 ? upcomingApts[0] : null;

    // Completed Treatments
    const completedTreatments = allHistory.filter(a => a.status === "Completed");

    // Cancelled Appointments
    const cancelledAppointments = allHistory.filter(a => a.status === "Cancelled" || a.status === "Rejected");

    return {
        totalVisits,
        firstVisitDate,
        latestAppointmentDate,
        currentStatus,
        upcomingAppointment,
        completedTreatments,
        cancelledAppointments,
        appointmentHistory: allHistory,
    };
};

/**
 * @desc    Create / Upsert Patient
 * @route   POST /api/patients
 * @access  Private (Doctor / Receptionist)
 */
const createPatient = async (req, res, next) => {
    try {
        const { name, phone, email } = req.body;

        const cleanedPhone = cleanPhoneHelper(phone);

        let patient = await Patient.findOne({
            $or: [
                { phone: cleanedPhone || phone },
                { phone: phone }
            ]
        });

        if (patient) {
            if (name && name.trim() !== "") patient.name = name;
            if (email && email.trim() !== "") patient.email = email;
            await patient.save();
        } else {
            patient = await Patient.create({
                name,
                phone: cleanedPhone || phone,
                email: email || "",
            });
        }

        const metrics = await getPatientAppointmentData(patient);

        return res.status(201).json({
            success: true,
            message: "Patient saved successfully.",
            data: {
                ...patient.toObject(),
                ...metrics,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get All Patients (Alphabetically sorted by name, unique by phone number)
 * @route   GET /api/patients
 * @access  Private
 */
const getPatients = async (req, res, next) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 100,
        } = req.query;

        let patients = await Patient.find();

        // Sort alphabetically by patient name (A-Z)
        patients.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

        const enrichedPatients = await Promise.all(
            patients.map(async (patientDoc) => {
                const metrics = await getPatientAppointmentData(patientDoc);
                return {
                    ...patientDoc.toObject(),
                    totalVisits: metrics.totalVisits,
                    firstVisitDate: metrics.firstVisitDate,
                    latestAppointmentDate: metrics.latestAppointmentDate,
                    currentStatus: metrics.currentStatus,
                    upcomingAppointment: metrics.upcomingAppointment,
                    completedTreatments: metrics.completedTreatments,
                    cancelledAppointments: metrics.cancelledAppointments,
                    appointmentHistory: metrics.appointmentHistory,
                };
            })
        );

        let filtered = enrichedPatients;
        if (search) {
            const keyword = search.toLowerCase();
            filtered = enrichedPatients.filter((p) => {
                return (
                    (p.name && p.name.toLowerCase().includes(keyword)) ||
                    (p.phone && p.phone.includes(search)) ||
                    (p.email && p.email.toLowerCase().includes(keyword)) ||
                    (p.currentStatus && p.currentStatus.toLowerCase().includes(keyword))
                );
            });
        }

        const total = filtered.length;
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedData = filtered.slice(startIndex, startIndex + Number(limit));

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)) || 1,
            count: paginatedData.length,
            data: paginatedData,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Patient By ID (With full details & history)
 * @route   GET /api/patients/:id
 * @access  Private
 */
const getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        const metrics = await getPatientAppointmentData(patient);

        return res.status(200).json({
            success: true,
            data: {
                ...patient.toObject(),
                ...metrics,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Patient Profile
 * @route   PUT /api/patients/:id
 * @access  Private (Doctor / Receptionist)
 */
const updatePatient = async (req, res, next) => {
    try {
        const { name, phone, email } = req.body;

        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        if (phone && phone !== patient.phone) {
            const cleanedPhone = cleanPhoneHelper(phone);
            const existingPatient = await Patient.findOne({
                _id: { $ne: patient._id },
                $or: [{ phone }, { phone: cleanedPhone }]
            });

            if (existingPatient) {
                return res.status(409).json({
                    success: false,
                    message: "Phone number is already associated with another patient profile.",
                });
            }
        }

        if (name) patient.name = name;
        if (phone) patient.phone = phone;
        if (email !== undefined) patient.email = email;

        await patient.save();
        const metrics = await getPatientAppointmentData(patient);

        return res.status(200).json({
            success: true,
            message: "Patient updated successfully.",
            data: {
                ...patient.toObject(),
                ...metrics,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Patient
 * @route   DELETE /api/patients/:id
 * @access  Private (Doctor)
 */
const deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        await patient.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Patient profile deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
};