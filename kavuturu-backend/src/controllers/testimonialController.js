// src/controllers/testimonialController.js

const Testimonial = require("../models/Testimonial");

/**
 * Parse human review date string into relative days ago for chronological sorting
 */
const parseReviewDateToDaysAgo = (str) => {
  if (!str || typeof str !== "string") return 99999;
  const lower = str.toLowerCase().trim();

  if (lower.includes("today") || lower.includes("just now") || lower.includes("recent")) return 0;
  if (lower.includes("yesterday")) return 1;

  const dayMatch = lower.match(/^(\d+)\s+day/);
  if (dayMatch) return parseInt(dayMatch[1], 10);

  const weekMatch = lower.match(/^(\d+)\s+week/);
  if (weekMatch) return parseInt(weekMatch[1], 10) * 7;

  const monthMatch = lower.match(/^(\d+)\s+month/);
  if (monthMatch) return parseInt(monthMatch[1], 10) * 30;

  const yearMatch = lower.match(/^(\d+)\s+year/);
  if (yearMatch) return parseInt(yearMatch[1], 10) * 365;

  const parsedDate = Date.parse(str);
  if (!isNaN(parsedDate)) {
    const diffMs = Date.now() - parsedDate;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return 99999;
};

/**
 * @desc    Get Testimonials (Homepage max 8, unlimited for full list, sorted by reviewDate chronologically)
 * @route   GET /api/website/testimonials
 * @access  Public
 */
const getTestimonials = async (req, res, next) => {
    try {
        const { homepage } = req.query;
        let query = { status: "Active" };

        let testimonials = await Testimonial.find(query);

        // Sort by human review date chronologically (most recent review date first)
        testimonials.sort((a, b) => {
            const daysA = parseReviewDateToDaysAgo(a.reviewDate);
            const daysB = parseReviewDateToDaysAgo(b.reviewDate);
            if (daysA !== daysB) {
                return daysA - daysB;
            }
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        // Apply homepage limit
        if (homepage === "true" && testimonials.length > 8) {
            testimonials = testimonials.slice(0, 8);
        }

        return res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Testimonial Review
 * @route   POST /api/website/testimonials
 * @access  Private (Doctor Only)
 */
const createTestimonial = async (req, res, next) => {
    try {

        const {
            patientName,
            comment,
            rating,
            reviewDate,
            status,
        } = req.body;

        if (!patientName || !comment || !rating || !reviewDate) {
            return res.status(400).json({
                success: false,
                message: "Patient Name, Review Comment, Rating, and Review Date are required.",
            });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5.",
            });
        }

        const testimonial = await Testimonial.create({
            patientName: patientName.trim(),
            comment: comment.trim(),
            rating: numRating,
            reviewDate: reviewDate.trim(),
            status: status || "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Review added successfully.",
            data: testimonial,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Testimonial Review
 * @route   PUT /api/website/testimonials/:id
 * @access  Private (Doctor Only)
 */
const updateTestimonial = async (req, res, next) => {
    try {
        const {
            patientName,
            comment,
            rating,
            reviewDate,
            status,
        } = req.body;

        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        if (rating !== undefined) {
            const numRating = Number(rating);
            if (isNaN(numRating) || numRating < 1 || numRating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be an integer between 1 and 5.",
                });
            }
            testimonial.rating = numRating;
        }

        if (patientName) testimonial.patientName = patientName.trim();
        if (comment) testimonial.comment = comment.trim();
        if (reviewDate) testimonial.reviewDate = reviewDate.trim();
        if (status) testimonial.status = status;

        await testimonial.save();

        return res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            data: testimonial,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Testimonial Review (Permanent deletion)
 * @route   DELETE /api/website/testimonials/:id
 * @access  Private (Doctor Only)
 */
const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        await testimonial.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};
