// src/controllers/aboutController.js

const About = require("../models/About");

/**
 * @desc    Get About Section Content
 * @route   GET /api/website/about
 * @access  Public
 */
const getAbout = async (req, res, next) => {
    try {
        let about = await About.findOne();

        if (!about) {
            about = await About.create({});
        }

        return res.status(200).json({
            success: true,
            data: about,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update About Section Content
 * @route   PUT /api/website/about
 * @access  Private (Doctor)
 */
const updateAbout = async (req, res, next) => {
    try {
        const {
            heading,
            description,
        } = req.body;

        let about = await About.findOne();

        if (!about) {
            about = await About.create({
                heading,
                description,
            });
        } else {
            about.heading = heading;
            about.description = description;

            await about.save();
        }

        return res.status(200).json({
            success: true,
            message: "About section updated successfully.",
            data: about,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAbout,
    updateAbout,
};