// src/controllers/treatmentController.js

const Treatment = require("../models/Treatment");
const { processCloudinaryImage, deleteFromCloudinary } = require("../utils/handleCloudinaryHelper");

const INITIAL_SEED_TREATMENTS = [
  {
    name: "Laser Root Canal Treatment",
    image: "",
    previewDescription: "Advanced pain-free root canal treatment using state-of-the-art diode laser technology.",
    fullDescription: "Root Canal Treatment (RCT) is performed to save a severely infected tooth. At Kavuturu Dental Clinic, we utilize advanced diode laser disinfection to eliminate bacteria deep within dentinal tubules, ensuring a faster, virtually painless procedure.",
    highlights: ["Laser Disinfection", "Pain-Free Procedure", "Single-Sitting RCT Available", "Long-Lasting Protection"],
    status: "Active",
    showOnHomepage: true,
    homepageOrder: 1,
    displayOrder: 1,
  },
  {
    name: "Dental Implants",
    image: "",
    previewDescription: "Permanent, natural-looking tooth replacement solution with lifetime warranty options.",
    fullDescription: "Dental implants are titanium posts surgically placed into the jawbone to serve as replacement root foundations for permanent crowns or bridges.",
    highlights: ["Biocompatible Titanium", "Natural Smile Appearance", "Preserves Bone Density", "High Success Rate"],
    status: "Active",
    showOnHomepage: true,
    homepageOrder: 2,
    displayOrder: 2,
  },
  {
    name: "Teeth Whitening & Bleaching",
    image: "",
    previewDescription: "In-office laser smile whitening that brightens discolored teeth by up to 8 shades.",
    fullDescription: "Professional laser teeth whitening removes stubborn stains caused by coffee, tea, smoking, and aging.",
    highlights: ["Up to 8 Shades Whiter", "Immediate Results", "Enamel-Safe Formulation", "Includes Touch-Up Kit"],
    status: "Active",
    showOnHomepage: true,
    homepageOrder: 3,
    displayOrder: 3,
  },
  {
    name: "Clear Aligners & Braces",
    image: "",
    previewDescription: "Invisible aligners and ceramic braces for perfect tooth alignment without metal wires.",
    fullDescription: "Straighten your teeth discreetly with custom clear aligners or aesthetic ceramic braces.",
    highlights: ["Virtually Invisible", "Removable & Easy Clean", "Custom 3D Digital Plan", "Comfortable Fit"],
    status: "Active",
    showOnHomepage: true,
    homepageOrder: 4,
    displayOrder: 4,
  },
];

/**
 * @desc    Get All Treatments
 * @route   GET /api/website/treatments
 * @access  Public
 */
const getTreatments = async (req, res, next) => {
    try {
        const { status, homepage } = req.query;
        const query = {};

        if (homepage === "true") {
            query.showOnHomepage = true;
            query.status = "Active";
        } else if (status && status !== "All") {
            query.status = status;
        }

        const sortOption = homepage === "true"
            ? { homepageOrder: 1, createdAt: -1 }
            : { displayOrder: 1, order: 1, createdAt: -1 };

        let treatments = await Treatment.find(query).sort(sortOption);

        if (treatments.length === 0 && !status && !homepage) {
            treatments = await Treatment.insertMany(INITIAL_SEED_TREATMENTS);
        }

        return res.status(200).json({
            success: true,
            count: treatments.length,
            data: treatments,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Single Treatment By ID
 * @route   GET /api/website/treatments/:id
 * @access  Public
 */
const getTreatmentById = async (req, res, next) => {
    try {
        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: "Treatment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: treatment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Treatment
 * @route   POST /api/website/treatments
 * @access  Private (Doctor Only)
 */
const createTreatment = async (req, res, next) => {
    try {
        const {
            name,
            image,
            previewDescription,
            fullDescription,
            highlights,
            status,
            showOnHomepage,
            homepageOrder,
            displayOrder,
            order,
        } = req.body;

        if (!name || !previewDescription || !fullDescription) {
            return res.status(400).json({
                success: false,
                message: "Treatment name, preview description, and full description are required.",
            });
        }

        const parsedHighlights = Array.isArray(highlights)
            ? highlights.filter((h) => typeof h === "string" && h.trim().length > 0)
            : [];

        if (parsedHighlights.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one treatment highlight is required.",
            });
        }

        let cloudImage = { secure_url: image || "", public_id: "" };
        if (image || req.file) {
            try {
                cloudImage = await processCloudinaryImage(image, req.file, "", "kavuturu-dental/treatments");
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Image upload failed: ${err.message}`,
                });
            }
        }

        const hpOrderNum = Number(homepageOrder) > 0 ? Number(homepageOrder) : 1;
        const dispOrderNum = Number(displayOrder) > 0 ? Number(displayOrder) : 1;

        const treatment = await Treatment.create({
            name: name.trim(),
            image: cloudImage.secure_url,
            public_id: cloudImage.public_id,
            previewDescription: previewDescription.trim(),
            fullDescription: fullDescription.trim(),
            highlights: parsedHighlights,
            status: status || "Active",
            showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
            homepageOrder: hpOrderNum,
            displayOrder: dispOrderNum,
            order: Number(order) || 0,
        });

        return res.status(201).json({
            success: true,
            message: "Treatment created successfully.",
            data: treatment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Treatment Details
 * @route   PUT /api/website/treatments/:id
 * @access  Private (Doctor Only)
 */
const updateTreatment = async (req, res, next) => {
    try {
        const {
            name,
            image,
            previewDescription,
            fullDescription,
            highlights,
            status,
            showOnHomepage,
            homepageOrder,
            displayOrder,
            order,
        } = req.body;

        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: "Treatment not found.",
            });
        }

        if (name) treatment.name = name.trim();
        
        if (image !== undefined || req.file) {
            try {
                const cloudImage = await processCloudinaryImage(image, req.file, treatment.public_id, "kavuturu-dental/treatments");
                treatment.image = cloudImage.secure_url;
                treatment.public_id = cloudImage.public_id;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Image replacement failed: ${err.message}`,
                });
            }
        }

        if (previewDescription) treatment.previewDescription = previewDescription.trim();
        if (fullDescription) treatment.fullDescription = fullDescription.trim();
        if (Array.isArray(highlights)) {
            const parsed = highlights.filter((h) => typeof h === "string" && h.trim().length > 0);
            if (parsed.length > 0) treatment.highlights = parsed;
        }
        if (status) treatment.status = status;
        if (showOnHomepage !== undefined) treatment.showOnHomepage = Boolean(showOnHomepage);
        if (homepageOrder !== undefined && Number(homepageOrder) > 0) treatment.homepageOrder = Number(homepageOrder);
        if (displayOrder !== undefined && Number(displayOrder) > 0) treatment.displayOrder = Number(displayOrder);
        if (order !== undefined) treatment.order = Number(order);

        await treatment.save();

        return res.status(200).json({
            success: true,
            message: "Treatment updated successfully.",
            data: treatment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Treatment
 * @route   DELETE /api/website/treatments/:id
 * @access  Private (Doctor Only)
 */
const deleteTreatment = async (req, res, next) => {
    try {
        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: "Treatment not found.",
            });
        }

        if (treatment.public_id) {
            await deleteFromCloudinary(treatment.public_id);
        }

        await treatment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Treatment deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTreatments,
    getTreatmentById,
    createTreatment,
    updateTreatment,
    deleteTreatment,
};
