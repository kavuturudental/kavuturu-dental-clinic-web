// src/models/BeforeAfter.js

const mongoose = require("mongoose");

const beforeAfterSchema = new mongoose.Schema(
    {
        treatmentName: {
            type: String,
            required: true,
            trim: true,
        },

        beforeImage: {
            type: String,
            required: true,
        },

        before_public_id: {
            type: String,
            default: "",
        },

        afterImage: {
            type: String,
            required: true,
        },

        after_public_id: {
            type: String,
            default: "",
        },

        showOnHomepage: {
            type: Boolean,
            default: false,
        },

        homepageOrder: {
            type: Number,
            default: 1,
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

module.exports = mongoose.model("BeforeAfter", beforeAfterSchema);
