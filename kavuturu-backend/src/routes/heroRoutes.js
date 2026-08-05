const express = require("express");
const router = express.Router();

const {
    getHero,
    updateHero,
} = require("../controllers/heroController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Route (Website)
router.get("/", getHero);

// Doctor Only (CMS)
router.put(
    "/",
    authenticateUser,
    authorizeRoles("doctor"),
    updateHero
);

module.exports = router;