// src/routes/galleryRoutes.js

const express = require("express");
const router = express.Router();

const {
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
} = require("../controllers/galleryController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Route
router.get("/", getGalleryImages);

// Doctor Only Routes
router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    createGalleryImage
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    updateGalleryImage
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteGalleryImage
);

module.exports = router;
