// src/utils/cloudinaryUpload.js

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {String} folder
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (buffer, folder = "kavuturu-dental") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                overwrite: true,
                quality: "auto",
                fetch_format: "auto",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = uploadToCloudinary;