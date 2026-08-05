// src/controllers/heroController.js

const Hero = require("../models/Hero");

/**
 * @desc    Get Hero Content
 * @route   GET /api/website/hero
 * @access  Public
 */
const getHero = async (req, res, next) => {
    try {
        let hero = await Hero.findOne();

        if (!hero) {
            hero = await Hero.create({});
        }

        return res.status(200).json({
            success: true,
            data: hero,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Hero Content
 * @route   PUT /api/website/hero
 * @access  Private (Doctor)
 */
const updateHero = async (req, res, next) => {
    try {
        const { trustBadge, heading, accentSubheading, description, stats } = req.body;

        let hero = await Hero.findOne();

        if (!hero) {
            hero = new Hero();
        }

        if (trustBadge !== undefined) hero.trustBadge = trustBadge;
        if (heading !== undefined) hero.heading = heading;
        if (accentSubheading !== undefined) hero.accentSubheading = accentSubheading;
        if (description !== undefined) hero.description = description;
        if (Array.isArray(stats)) hero.stats = stats;

        await hero.save();

        return res.status(200).json({
            success: true,
            message: "Hero section updated successfully.",
            data: hero,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHero,
    updateHero,
};