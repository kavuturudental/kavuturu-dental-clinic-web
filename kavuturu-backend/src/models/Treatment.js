// src/models/Treatment.js

const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        public_id: {
            type: String,
            default: "",
        },

        previewDescription: {
            type: String,
            required: true,
            trim: true,
        },

        fullDescription: {
            type: String,
            required: true,
            trim: true,
        },

        highlights: [
            {
                type: String,
                trim: true,
            },
        ],

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },

        showOnHomepage: {
            type: Boolean,
            default: true,
        },

        homepageOrder: {
            type: Number,
            default: 1,
        },

        displayOrder: {
            type: Number,
            default: 1,
        },

        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
