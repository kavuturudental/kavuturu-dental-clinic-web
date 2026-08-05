// src/controllers/receptionistController.js

const User = require("../models/User");

/**
 * Email format regex validation helper
 */
const isValidEmail = (emailStr) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(emailStr).toLowerCase());
};

/**
 * Phone number validation helper
 */
const isValidPhone = (phoneStr) => {
  if (!phoneStr || typeof phoneStr !== "string") return false;
  // Allows optional +, spaces, hyphens, and digits (7-15 digits total)
  const digitsOnly = phoneStr.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

/**
 * @desc    Get All Receptionist Accounts
 * @route   GET /api/doctor/receptionists
 * @access  Private (Doctor Only)
 */
const getReceptionists = async (req, res, next) => {
  try {
    const receptionists = await User.find({ role: "receptionist" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: receptionists.length,
      data: receptionists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a New Receptionist Account
 * @route   POST /api/doctor/receptionists
 * @access  Private (Doctor Only)
 */
const createReceptionist = async (req, res, next) => {
  try {
    // 1. Receptionist Limit Check (Max 5)
    const currentCount = await User.countDocuments({ role: "receptionist" });
    if (currentCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "You have reached the maximum limit of 5 receptionist accounts. Please delete an existing receptionist before adding a new one.",
      });
    }

    const { name, email, phone, password, confirmPassword, status, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receptionist Name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email Address is required.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Uniqueness check
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is required.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match.",
      });
    }

    let activeState = true;
    if (typeof isActive === "boolean") {
      activeState = isActive;
    } else if (typeof status === "string") {
      activeState = status.toLowerCase() === "active";
    }

    const receptionist = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      password,
      role: "receptionist",
      isActive: activeState,
    });

    const returnedUser = receptionist.toObject();
    delete returnedUser.password;

    return res.status(201).json({
      success: true,
      message: "Receptionist created successfully.",
      data: returnedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit Receptionist Details (Name, Email, Phone, Status)
 * @route   PUT /api/doctor/receptionists/:id
 * @access  Private (Doctor Only)
 */
const updateReceptionist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, isActive } = req.body;

    const receptionist = await User.findOne({ _id: id, role: "receptionist" });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receptionist Name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email Address is required.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check email uniqueness if changed
    if (trimmedEmail !== receptionist.email) {
      const emailExists = await User.findOne({ email: trimmedEmail });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "An account with this email address already exists.",
        });
      }
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is required.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    receptionist.name = name.trim();
    receptionist.email = trimmedEmail;
    receptionist.phone = phone.trim();

    if (typeof isActive === "boolean") {
      receptionist.isActive = isActive;
    } else if (typeof status === "string") {
      receptionist.isActive = status.toLowerCase() === "active";
    }

    await receptionist.save();

    const returnedUser = receptionist.toObject();
    delete returnedUser.password;

    return res.status(200).json({
      success: true,
      message: "Receptionist updated successfully.",
      data: returnedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Receptionist Password
 * @route   PUT /api/doctor/receptionists/:id/reset-password
 * @access  Private (Doctor Only)
 */
const resetReceptionistPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const receptionist = await User.findOne({ _id: id, role: "receptionist" });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and Confirm Password must match.",
      });
    }

    receptionist.password = newPassword;
    await receptionist.save();

    return res.status(200).json({
      success: true,
      message: "Receptionist password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Receptionist (Permanent remove from MongoDB)
 * @route   DELETE /api/doctor/receptionists/:id
 * @access  Private (Doctor Only)
 */
const deleteReceptionist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const receptionist = await User.findOneAndDelete({ _id: id, role: "receptionist" });

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Receptionist deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReceptionists,
  createReceptionist,
  updateReceptionist,
  resetReceptionistPassword,
  deleteReceptionist,
};
