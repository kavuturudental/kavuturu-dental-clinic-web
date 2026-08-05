// src/utils/cloudinaryDelete.js

const cloudinary = require("../config/cloudinary");

/**
 * Delete image from Cloudinary
 * @param {String} publicId
 */
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return null;

    return await cloudinary.uploader.destroy(publicId);
};

module.exports = deleteFromCloudinary;