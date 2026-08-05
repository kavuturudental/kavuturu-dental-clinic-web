// src/models/Testimonial.js

const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        patientName: {
            type: String,
            required: true,
            trim: true,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5,
        },

        reviewDate: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
