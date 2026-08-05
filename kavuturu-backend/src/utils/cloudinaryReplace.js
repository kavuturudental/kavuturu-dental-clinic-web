// src/utils/cloudinaryReplace.js

const uploadToCloudinary = require("./cloudinaryUpload");
const deleteFromCloudinary = require("./cloudinaryDelete");

/**
 * Replace an existing Cloudinary image
 *
 * @param {Buffer} buffer
 * @param {String} oldPublicId
 * @param {String} folder
 */
const replaceCloudinaryImage = async (
    buffer,
    oldPublicId,
    folder = "kavuturu-dental"
) => {
    if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId);
    }

    return await uploadToCloudinary(buffer, folder);
};

module.exports = replaceCloudinaryImage;