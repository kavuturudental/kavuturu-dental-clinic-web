// src/utils/handleCloudinaryHelper.js

const uploadToCloudinary = require("./cloudinaryUpload");
const deleteFromCloudinary = require("./cloudinaryDelete");
const replaceCloudinaryImage = require("./cloudinaryReplace");

/**
 * Process image upload/replacement to Cloudinary safely
 * @param {String|Buffer} imageInput Base64 data URI string, existing URL, or Buffer
 * @param {Object} file Optional Multer file object
 * @param {String} oldPublicId Optional existing Cloudinary public_id
 * @param {String} folder Destination Cloudinary folder
 * @returns {Promise<{ secure_url: String, public_id: String }>}
 */
const processCloudinaryImage = async (imageInput, file, oldPublicId = "", folder = "kavuturu-dental") => {
    let buffer = null;

    if (file && file.buffer) {
        buffer = file.buffer;
    } else if (typeof imageInput === "string" && imageInput.startsWith("data:image/")) {
        const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, "");
        buffer = Buffer.from(base64Data, "base64");
    }

    // If new image buffer is available, upload / replace in Cloudinary
    if (buffer) {
        let result;
        if (oldPublicId) {
            result = await replaceCloudinaryImage(buffer, oldPublicId, folder);
        } else {
            result = await uploadToCloudinary(buffer, folder);
        }
        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    }

    // If no new image buffer provided, return existing image URL & public_id
    return {
        secure_url: typeof imageInput === "string" ? imageInput : "",
        public_id: oldPublicId || "",
    };
};

module.exports = {
    processCloudinaryImage,
    deleteFromCloudinary,
};
