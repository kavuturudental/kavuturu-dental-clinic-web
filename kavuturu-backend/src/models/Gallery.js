// src/models/Gallery.js

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },

        public_id: {
            type: String,
            default: "",
        },

        showOnHomepage: {
            type: Boolean,
            default: false,
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

module.exports = mongoose.model("Gallery", gallerySchema);
