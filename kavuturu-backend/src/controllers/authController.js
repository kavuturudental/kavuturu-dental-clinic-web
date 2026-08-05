// src/controllers/authController.js

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../services/emailService");

/**
 * Validate email format helper
 */
const isValidEmail = (emailStr) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(emailStr).toLowerCase());
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          qualification: user.qualification || "BDS, MDS – Conservative Dentistry & Endodontics",
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Logged-in User Profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Profile (Doctor Profile)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, qualification, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    user.name = name.trim();

    if (user.role === "doctor") {
      if (!qualification || !qualification.trim()) {
        return res.status(400).json({
          success: false,
          message: "Qualification is required.",
        });
      }
      user.qualification = qualification.trim();

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

      if (trimmedEmail !== user.email) {
        const emailExists = await User.findOne({ email: trimmedEmail });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email address is already in use by another account.",
          });
        }
      }

      user.email = trimmedEmail;
      if (phone !== undefined) {
        user.phone = phone ? phone.trim() : user.phone;
      }
    } else if (user.role === "receptionist") {
      // Receptionists can ONLY edit their display name. Email & Phone remain locked as entered by Doctor.
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        qualification: user.qualification || "BDS, MDS – Conservative Dentistry & Endodontics",
        role: user.role,
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change Password (Logged in Doctor)
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required.",
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and Confirm Password must match.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Search user, generate 15-min token & send email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Search User collection (Doctor or Receptionist)
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    // Generate 32-byte crypto token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token to store in DB securely
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

    await user.save({ validateBeforeSave: false });

    // Construct reset password link
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; border-b: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0E2A6D; margin: 0; font-size: 20px;">Kavuturu Dental Clinic</h2>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Password Recovery System</p>
        </div>
        
        <p style="color: #1e293b; font-size: 14px; font-weight: bold; margin-bottom: 12px;">
          Hello ${user.name},
        </p>
        
        <p style="color: #475569; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset the password for your account. Please click the button below to set a new password:
        </p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #0E2A6D; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(14,42,109,0.25);">
            Reset Password
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-bottom: 16px;">
          If the button does not work, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #0E2A6D; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 10px; padding: 12px; margin-top: 20px;">
          <p style="color: #dc2626; font-size: 12px; font-weight: bold; margin: 0;">
            ⚠️ This link will automatically expire in 15 minutes.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;"/>
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Kavuturu Dental Clinic",
        html: emailHtml,
      });
    } catch (err) {
      console.error("Email send warning:", err);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Reset Password Token Status
 * @route   GET /api/auth/verify-reset-token/:token
 * @access  Public
 */
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with Valid Token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword, newPassword } = req.body;

    const passVal = password || newPassword;

    if (!passVal || passVal.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters.",
      });
    }

    if (passVal !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords must match.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    // Set new hashed password
    user.password = passVal;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

module.exports = {
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  logoutUser,
};