// src/routes/beforeAfterRoutes.js

const express = require("express");
const router = express.Router();

const {
    getBeforeAfterCases,
    createBeforeAfterCase,
    updateBeforeAfterCase,
    deleteBeforeAfterCase,
} = require("../controllers/beforeAfterController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Route
router.get("/", getBeforeAfterCases);

// Doctor Only Routes
router.post(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    createBeforeAfterCase
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    updateBeforeAfterCase
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("doctor"),
    deleteBeforeAfterCase
);

module.exports = router;
