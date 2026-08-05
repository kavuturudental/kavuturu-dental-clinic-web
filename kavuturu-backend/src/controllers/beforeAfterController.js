// src/controllers/beforeAfterController.js

const BeforeAfter = require("../models/BeforeAfter");
const { processCloudinaryImage, deleteFromCloudinary } = require("../utils/handleCloudinaryHelper");

const DEFAULT_CASES = [
  {
    treatmentName: "Laser Root Canal Treatment",
    beforeImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    afterImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    homepageOrder: 1,
    displayOrder: 1,
    status: "Active",
  },
  {
    treatmentName: "Aesthetic Composite Restorations",
    beforeImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    afterImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    homepageOrder: 2,
    displayOrder: 2,
    status: "Active",
  },
  {
    treatmentName: "Full Mouth Dental Implants",
    beforeImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    afterImage: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    showOnHomepage: true,
    homepageOrder: 3,
    displayOrder: 3,
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
 * @desc    Get Before & After Cases
 * @route   GET /api/website/before-after
 * @access  Public
 */
const getBeforeAfterCases = async (req, res, next) => {
    try {
        const { homepage } = req.query;
        let query = { status: "Active" };
        let sort = { displayOrder: 1, createdAt: -1 };
        let limit = 0;

        if (homepage === "true") {
            query.showOnHomepage = true;
            sort = { homepageOrder: 1, createdAt: -1 };
            limit = 3;
        }

        let casesQuery = BeforeAfter.find(query).sort(sort);
        if (limit > 0) {
            casesQuery = casesQuery.limit(limit);
        }

        let cases = await casesQuery;

        if (cases.length === 0 && !homepage) {
            await BeforeAfter.insertMany(DEFAULT_CASES);
            cases = await BeforeAfter.find(query).sort(sort);
        }

        return res.status(200).json({
            success: true,
            count: cases.length,
            data: cases,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Before & After Case
 * @route   POST /api/website/before-after
 * @access  Private (Doctor Only)
 */
const createBeforeAfterCase = async (req, res, next) => {
    try {
        const {
            treatmentName,
            beforeImage,
            afterImage,
            showOnHomepage,
            homepageOrder,
            displayOrder,
            status,
        } = req.body;

        if (!treatmentName || !beforeImage || !afterImage) {
            return res.status(400).json({
                success: false,
                message: "Treatment Name, Before Image, and After Image are required.",
            });
        }

        let beforeCloud = { secure_url: beforeImage, public_id: "" };
        let afterCloud = { secure_url: afterImage, public_id: "" };

        try {
            beforeCloud = await processCloudinaryImage(beforeImage, req.files?.beforeImage?.[0], "", "kavuturu-dental/before-after");
            afterCloud = await processCloudinaryImage(afterImage, req.files?.afterImage?.[0], "", "kavuturu-dental/before-after");
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: `Image upload failed: ${err.message}`,
            });
        }

        const newCase = await BeforeAfter.create({
            treatmentName: treatmentName.trim(),
            beforeImage: beforeCloud.secure_url,
            before_public_id: beforeCloud.public_id,
            afterImage: afterCloud.secure_url,
            after_public_id: afterCloud.public_id,
            showOnHomepage: Boolean(showOnHomepage),
            homepageOrder: Number(homepageOrder) > 0 ? Number(homepageOrder) : 1,
            displayOrder: Number(displayOrder) > 0 ? Number(displayOrder) : 1,
            status: status || "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Before & After case created successfully.",
            data: newCase,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Before & After Case
 * @route   PUT /api/website/before-after/:id
 * @access  Private (Doctor Only)
 */
const updateBeforeAfterCase = async (req, res, next) => {
    try {
        const {
            treatmentName,
            beforeImage,
            afterImage,
            showOnHomepage,
            homepageOrder,
            displayOrder,
            status,
        } = req.body;

        const caseItem = await BeforeAfter.findById(req.params.id);

        if (!caseItem) {
            return res.status(404).json({
                success: false,
                message: "Before & After case not found.",
            });
        }

        if (beforeImage || req.files?.beforeImage) {
            try {
                const beforeCloud = await processCloudinaryImage(beforeImage, req.files?.beforeImage?.[0], caseItem.before_public_id, "kavuturu-dental/before-after");
                caseItem.beforeImage = beforeCloud.secure_url;
                caseItem.before_public_id = beforeCloud.public_id;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Before image replacement failed: ${err.message}`,
                });
            }
        }

        if (afterImage || req.files?.afterImage) {
            try {
                const afterCloud = await processCloudinaryImage(afterImage, req.files?.afterImage?.[0], caseItem.after_public_id, "kavuturu-dental/before-after");
                caseItem.afterImage = afterCloud.secure_url;
                caseItem.after_public_id = afterCloud.public_id;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `After image replacement failed: ${err.message}`,
                });
            }
        }

        if (treatmentName) caseItem.treatmentName = treatmentName.trim();
        if (showOnHomepage !== undefined) caseItem.showOnHomepage = Boolean(showOnHomepage);
        if (homepageOrder !== undefined && Number(homepageOrder) > 0) caseItem.homepageOrder = Number(homepageOrder);
        if (displayOrder !== undefined && Number(displayOrder) > 0) caseItem.displayOrder = Number(displayOrder);
        if (status) caseItem.status = status;

        await caseItem.save();

        return res.status(200).json({
            success: true,
            message: "Before & After case updated successfully.",
            data: caseItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Before & After Case
 * @route   DELETE /api/website/before-after/:id
 * @access  Private (Doctor Only)
 */
const deleteBeforeAfterCase = async (req, res, next) => {
    try {
        const caseItem = await BeforeAfter.findById(req.params.id);

        if (!caseItem) {
            return res.status(404).json({
                success: false,
                message: "Before & After case not found.",
            });
        }

        if (caseItem.before_public_id) {
            await deleteFromCloudinary(caseItem.before_public_id);
        }
        if (caseItem.after_public_id) {
            await deleteFromCloudinary(caseItem.after_public_id);
        }

        await caseItem.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Before & After case deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBeforeAfterCases,
    createBeforeAfterCase,
    updateBeforeAfterCase,
    deleteBeforeAfterCase,
};
