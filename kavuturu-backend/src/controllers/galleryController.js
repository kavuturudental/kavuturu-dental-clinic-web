// src/controllers/galleryController.js

const Gallery = require("../models/Gallery");
const { processCloudinaryImage, deleteFromCloudinary } = require("../utils/handleCloudinaryHelper");

const DEFAULT_GALLERY_IMAGES = [
  {
    title: "State-of-the-Art Dental Clinic Facility",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
  {
    title: "Advanced Laser Treatment Room",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
  {
    title: "Hygienic Patient Care & Reception",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
  {
    title: "Digital 3D Diagnostics Suite",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
  {
    title: "Sterilized Operatory Suite",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
  {
    title: "Comfortable Patient Consultation Lounge",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    status: "Active",
  },
];

/**
 * Validate WEBP image format helper
 */
const isWebpImage = (str) => {
  if (!str || typeof str !== "string") return false;
  const lower = str.toLowerCase();
  if (lower.startsWith("data:image/webp")) return true;
  if (lower.includes(".webp")) return true;
  return false;
};

/**
 * @desc    Get Gallery Images (Homepage max 8, unlimited for full gallery)
 * @route   GET /api/website/gallery
 * @access  Public
 */
const getGalleryImages = async (req, res, next) => {
    try {
        const { homepage } = req.query;
        let query = { status: "Active" };

        if (homepage === "true") {
            query.showOnHomepage = true;
        }

        let imagesQuery = Gallery.find(query).sort({ createdAt: -1 });
        if (homepage === "true") {
            imagesQuery = imagesQuery.limit(8);
        }

        let images = await imagesQuery;

        if (images.length === 0 && !homepage) {
            await Gallery.insertMany(DEFAULT_GALLERY_IMAGES);
            images = await Gallery.find(query).sort({ createdAt: -1 });
        }

        return res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Gallery Image
 * @route   POST /api/website/gallery
 * @access  Private (Doctor Only)
 */
const createGalleryImage = async (req, res, next) => {
    try {

        const {
            title,
            image,
            showOnHomepage,
            status,
        } = req.body;

        if (!title || (!image && !req.file)) {
            return res.status(400).json({
                success: false,
                message: "Image Title and Gallery Image file are required.",
            });
        }

        let cloudImage = { secure_url: image || "", public_id: "" };
        if (image || req.file) {
            try {
                cloudImage = await processCloudinaryImage(image, req.file, "", "kavuturu-dental/gallery");
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Gallery image upload failed: ${err.message}`,
                });
            }
        }

        const galleryItem = await Gallery.create({
            title: title.trim(),
            image: cloudImage.secure_url,
            public_id: cloudImage.public_id,
            showOnHomepage: Boolean(showOnHomepage),
            status: status || "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Gallery image uploaded successfully.",
            data: galleryItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Gallery Image
 * @route   PUT /api/website/gallery/:id
 * @access  Private (Doctor Only)
 */
const updateGalleryImage = async (req, res, next) => {
    try {
        const {
            title,
            image,
            showOnHomepage,
            status,
        } = req.body;

        const galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found.",
            });
        }

        if (image !== undefined || req.file) {
            try {
                const cloudImage = await processCloudinaryImage(image, req.file, galleryItem.public_id, "kavuturu-dental/gallery");
                galleryItem.image = cloudImage.secure_url;
                galleryItem.public_id = cloudImage.public_id;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Gallery image replacement failed: ${err.message}`,
                });
            }
        }

        if (title) galleryItem.title = title.trim();
        if (showOnHomepage !== undefined) galleryItem.showOnHomepage = Boolean(showOnHomepage);
        if (status) galleryItem.status = status;

        await galleryItem.save();

        return res.status(200).json({
            success: true,
            message: "Gallery image updated successfully.",
            data: galleryItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Gallery Image (Permanent deletion)
 * @route   DELETE /api/website/gallery/:id
 * @access  Private (Doctor Only)
 */
const deleteGalleryImage = async (req, res, next) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found.",
            });
        }

        if (galleryItem.public_id) {
            await deleteFromCloudinary(galleryItem.public_id);
        }

        await galleryItem.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
};
