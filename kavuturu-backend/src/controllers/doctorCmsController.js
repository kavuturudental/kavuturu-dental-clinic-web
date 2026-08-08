// src/controllers/doctorCmsController.js

const Doctor = require("../models/Doctor");

const DEFAULT_FEATURED_DOCTOR = {
  name: "Dr. K. Ravindra Babu",
  qualification: "BDS, MDS (Endodontics)",
  specialization: "Root Canal Specialist & Dental Surgeon",
  profileSummary: "Dr. Ravindrababu is a distinguished Endodontist with extensive experience in pain-free laser root canals and cosmetic smile design. Dedicated to patient comfort and clinical precision.",
  experience: "14+ Years",
  stats: [
    { value: "20,000+", label: "Root Canal Treatments" },
    { value: "25,000+", label: "Happy Patients" },
    { value: "14+", label: "Years Experience" },
    { value: "4.9", label: "Google Rating" },
  ],
  isFeatured: true,
  displayOrder: 1,
  status: "Active",
};

const DEFAULT_SECONDARY_DOCTORS = [
  {
    name: "Dr. S. A. Rahaman",
    qualification: "BDS, MDS (Oral & Maxillofacial Surgery)",
    specialization: "Consultant Oral & Maxillofacial Surgeon",
    profileSummary: "Specialist in complex tooth extractions, wisdom teeth surgeries, jaw bone grafting, and dental implant placement.",
    experience: "10+ Years",
    stats: [],
    isFeatured: false,
    displayOrder: 2,
    status: "Active",
  },
  {
    name: "Dr. V. Mounika",
    qualification: "BDS, MDS (Orthodontics)",
    specialization: "Consultant Orthodontist",
    profileSummary: "Expert in invisible clear aligners, ceramic braces, and pediatric jaw alignment treatments for kids and adults.",
    experience: "8+ Years",
    stats: [],
    isFeatured: false,
    displayOrder: 3,
    status: "Active",
  },
  {
    name: "Dr. P. Sneha",
    qualification: "BDS, MDS (Pedodontics)",
    specialization: "Consultant Pediatric Dentist",
    profileSummary: "Friendly child dental specialist focusing on preventative care, fluorides, sealants, and painless kids dental care.",
    experience: "", // Optional empty experience
    stats: [],
    isFeatured: false,
    displayOrder: 4,
    status: "Active",
  },
];

/**
 * @desc    Get Homepage Featured Doctor
 * @route   GET /api/website/doctors/featured
 * @access  Public
 */
const getFeaturedDoctor = async (req, res, next) => {
    try {
        let doctor = await Doctor.findOne({ isFeatured: true });

        if (!doctor) {
            doctor = await Doctor.create(DEFAULT_FEATURED_DOCTOR);
        }

        return res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Homepage Featured Doctor
 * @route   PUT /api/website/doctors/featured
 * @access  Private (Doctor Only)
 */
const updateFeaturedDoctor = async (req, res, next) => {
    try {
        const { name, qualification, specialization, profileSummary, stats } = req.body;

        if (!name || !qualification || !specialization || !profileSummary) {
            return res.status(400).json({
                success: false,
                message: "Doctor name, qualification, specialization, and profile summary are required.",
            });
        }

        let doctor = await Doctor.findOne({ isFeatured: true });

        if (!doctor) {
            doctor = new Doctor(DEFAULT_FEATURED_DOCTOR);
        }

        doctor.name = name.trim();
        doctor.qualification = qualification.trim();
        doctor.specialization = specialization.trim();
        doctor.profileSummary = profileSummary.trim();

        if (Array.isArray(stats)) {
            doctor.stats = stats.map((s) => ({
                value: (s.value || "").trim(),
                label: (s.label || "").trim(),
            })).filter((s) => s.value.length > 0 && s.label.length > 0);
        }

        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Featured Doctor details updated successfully.",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get All Active Doctors List (For Doctors Page)
 * @route   GET /api/website/doctors
 * @access  Public
 */
const getAllDoctors = async (req, res, next) => {
    try {
        let doctors = await Doctor.find({ status: "Active" }).sort({ isFeatured: -1, displayOrder: 1, createdAt: 1 });

        if (doctors.length === 0) {
            await Doctor.create(DEFAULT_FEATURED_DOCTOR);
            await Doctor.insertMany(DEFAULT_SECONDARY_DOCTORS);
            doctors = await Doctor.find({ status: "Active" }).sort({ isFeatured: -1, displayOrder: 1, createdAt: 1 });
        }

        return res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Secondary Doctor
 * @route   POST /api/website/doctors
 * @access  Private (Doctor Only)
 */
const createDoctor = async (req, res, next) => {
    try {
        const {
            name,
            qualification,
            specialization,
            profileSummary,
            experience,
            displayOrder,
            status,
        } = req.body;

        if (!name || !qualification || !specialization || !profileSummary) {
            return res.status(400).json({
                success: false,
                message: "Doctor name, qualification, specialization, and profile summary are required.",
            });
        }

        const trimmedName = name.trim();
        const trimmedQual = qualification.trim();
        const trimmedSpec = specialization.trim();
        const trimmedExp = (experience || "").trim();

        // Duplicate Check: check if a doctor with identical name, qualification, specialization, and experience exists
        const allDoctors = await Doctor.find({});
        const isDuplicate = allDoctors.some(
            (d) =>
                d.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
                d.qualification.trim().toLowerCase() === trimmedQual.toLowerCase() &&
                d.specialization.trim().toLowerCase() === trimmedSpec.toLowerCase() &&
                (d.experience || "").trim().toLowerCase() === trimmedExp.toLowerCase()
        );

        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: "Duplicate doctor details! A doctor with identical Name, Qualification, Specialization, and Experience already exists.",
            });
        }

        const doctor = await Doctor.create({
            name: trimmedName,
            qualification: trimmedQual,
            specialization: trimmedSpec,
            profileSummary: profileSummary.trim(),
            experience: trimmedExp,
            isFeatured: false,
            displayOrder: Number(displayOrder) > 0 ? Number(displayOrder) : 1,
            status: status || "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Secondary Doctor Details
 * @route   PUT /api/website/doctors/:id
 * @access  Private (Doctor Only)
 */
const updateDoctor = async (req, res, next) => {
    try {
        const {
            name,
            qualification,
            specialization,
            profileSummary,
            experience,
            displayOrder,
            status,
        } = req.body;

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        const newName = (name !== undefined ? name : doctor.name).trim();
        const newQual = (qualification !== undefined ? qualification : doctor.qualification).trim();
        const newSpec = (specialization !== undefined ? specialization : doctor.specialization).trim();
        const newExp = (experience !== undefined ? experience : doctor.experience || "").trim();

        // Duplicate Check: check if another doctor with identical details exists
        const allDoctors = await Doctor.find({ _id: { $ne: req.params.id } });
        const isDuplicate = allDoctors.some(
            (d) =>
                d.name.trim().toLowerCase() === newName.toLowerCase() &&
                d.qualification.trim().toLowerCase() === newQual.toLowerCase() &&
                d.specialization.trim().toLowerCase() === newSpec.toLowerCase() &&
                (d.experience || "").trim().toLowerCase() === newExp.toLowerCase()
        );

        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: "Duplicate doctor details! A doctor with identical Name, Qualification, Specialization, and Experience already exists.",
            });
        }

        if (name) doctor.name = newName;
        if (qualification) doctor.qualification = newQual;
        if (specialization) doctor.specialization = newSpec;
        if (profileSummary) doctor.profileSummary = profileSummary.trim();
        if (experience !== undefined) doctor.experience = newExp;
        if (displayOrder !== undefined && Number(displayOrder) > 0) doctor.displayOrder = Number(displayOrder);
        if (status) doctor.status = status;

        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully.",
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Doctor
 * @route   DELETE /api/website/doctors/:id
 * @access  Private (Doctor Only)
 */
const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        if (doctor.isFeatured) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete the Homepage Featured Doctor.",
            });
        }

        await doctor.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Doctor deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFeaturedDoctor,
    updateFeaturedDoctor,
    getAllDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};
