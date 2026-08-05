// src/controllers/contactController.js

const Contact = require("../models/Contact");

const DEFAULT_CONTACT = {
  address: "Kavuturu Dental Clinic, Near XXX Road, Tirupati, Andhra Pradesh - 517501",
  primaryPhone: "+91 9876543210",
  secondaryPhone: "+91 9123456789",
  email: "contact@kavuturudental.com",
  mapsLink: "https://maps.google.com/?q=Kavuturu+Dental+Clinic+Tirupati",
  timings: {
    monFri: "9:00 AM – 8:00 PM",
    saturday: "9:00 AM – 6:00 PM",
    sunday: "Closed",
  },
  socialLinks: {
    instagram: "https://instagram.com/kavuturudental",
    facebook: "https://facebook.com/kavuturudental",
    whatsapp: "https://wa.me/919876543210",
  },
};

/**
 * Extract clean URL if full <iframe src="..."> HTML code was passed
 */
const extractMapsUrl = (rawStr) => {
  if (!rawStr || typeof rawStr !== "string") return "";
  const trimmed = rawStr.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  return trimmed;
};

/**
 * Validate URL format helper
 */
const isValidUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string" || !urlStr.trim()) return true;
  const cleanUrl = extractMapsUrl(urlStr);
  try {
    new URL(cleanUrl);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate email format helper
 */
const isValidEmail = (emailStr) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(emailStr).toLowerCase());
};

/**
 * @desc    Get Contact Information (Single record)
 * @route   GET /api/website/contact
 * @access  Public
 */
const getContact = async (req, res, next) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create(DEFAULT_CONTACT);
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Contact Information (Modify single record)
 * @route   PUT /api/website/contact
 * @access  Private (Doctor Only)
 */
const updateContact = async (req, res, next) => {
  try {
    const {
      address,
      primaryPhone,
      secondaryPhone,
      email,
      mapsLink,
      timings,
      socialLinks,
    } = req.body;

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Clinic Address is required.",
      });
    }

    if (!primaryPhone || !primaryPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Primary Phone Number is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email Address is required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const cleanedMapsLink = extractMapsUrl(mapsLink);

    if (!cleanedMapsLink) {
      return res.status(400).json({
        success: false,
        message: "Google Maps Link is required.",
      });
    }

    if (!isValidUrl(cleanedMapsLink)) {
      return res.status(400).json({
        success: false,
        message: "Google Maps Link must be a valid URL.",
      });
    }

    if (socialLinks?.instagram && !isValidUrl(socialLinks.instagram)) {
      return res.status(400).json({
        success: false,
        message: "Instagram Link must be a valid URL.",
      });
    }

    if (socialLinks?.facebook && !isValidUrl(socialLinks.facebook)) {
      return res.status(400).json({
        success: false,
        message: "Facebook Link must be a valid URL.",
      });
    }

    if (socialLinks?.whatsapp && !isValidUrl(socialLinks.whatsapp)) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp Link must be a valid URL.",
      });
    }

    const payload = {
      address: address.trim(),
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone ? secondaryPhone.trim() : "",
      email: email.trim().toLowerCase(),
      mapsLink: cleanedMapsLink,
      timings: {
        monFri: timings?.monFri || "9:00 AM – 8:00 PM",
        saturday: timings?.saturday || "9:00 AM – 6:00 PM",
        sunday: timings?.sunday || "Closed",
      },
      socialLinks: {
        instagram: socialLinks?.instagram ? socialLinks.instagram.trim() : "",
        facebook: socialLinks?.facebook ? socialLinks.facebook.trim() : "",
        whatsapp: socialLinks?.whatsapp ? socialLinks.whatsapp.trim() : "",
      },
    };

    // Upsert single document
    const updatedContact = await Contact.findOneAndUpdate(
      {},
      payload,
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Contact Information updated successfully.",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContact,
  updateContact,
};
