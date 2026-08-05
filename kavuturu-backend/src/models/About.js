// src/models/About.js

const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            trim: true,
            default: "Creating Healthy, Confident Smiles Every Day",
        },

        description: {
            type: String,
            required: true,
            trim: true,
            default:
                "At Kavuturu Dental Clinic, we are committed to providing advanced, comfortable, and personalized dental care for every patient. Our experienced team combines modern technology with compassionate treatment to help you achieve a healthy, confident smile in a welcoming environment.",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("About", aboutSchema);