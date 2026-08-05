// src/models/Doctor.js

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            required: true,
            trim: true,
        },

        specialization: {
            type: String,
            required: true,
            trim: true,
        },

        profileSummary: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: String,
            default: "",
            trim: true,
        },

        stats: [
            {
                value: { type: String, trim: true },
                label: { type: String, trim: true },
            },
        ],

        isFeatured: {
            type: Boolean,
            default: false,
        },

        displayOrder: {
            type: Number,
            default: 1,
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

module.exports = mongoose.model("Doctor", doctorSchema);
