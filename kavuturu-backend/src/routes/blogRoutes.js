// src/routes/blogRoutes.js

const express = require("express");
const router = express.Router();

const {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public Routes
router.get("/", getBlogs);
router.get("/:identifier", getBlogBySlugOrId);
router.get("/slug/:slug", getBlogBySlugOrId);

// Doctor Only Routes
router.post(
  "/",
  authenticateUser,
  authorizeRoles("doctor"),
  createBlog
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("doctor"),
  updateBlog
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("doctor"),
  deleteBlog
);

module.exports = router;
