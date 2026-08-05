// src/routes/patientRoutes.js

const express = require("express");

const {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
} = require("../controllers/patientController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const { patientSchema } = require("../validations/patientValidation");

const router = express.Router();

/**
 * @route   POST /api/patients
 * @desc    Create Patient
 * @access  Doctor, Receptionist
 */
router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    validateRequest(patientSchema),
    createPatient
);

/**
 * @route   GET /api/patients
 * @desc    Get All Patients
 * @access  Doctor, Receptionist
 */
router.get(
    "/",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getPatients
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get Patient By ID
 * @access  Doctor, Receptionist
 */
router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    getPatientById
);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update Patient
 * @access  Doctor, Receptionist
 */
router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor", "receptionist"),
    validateRequest(patientSchema),
    updatePatient
);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete Patient
 * @access  Doctor
 */
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deletePatient
);

module.exports = router;