// src/models/Patient.js

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Patient name is required"],
            trim: true,
            maxlength: [100, "Patient name cannot exceed 100 characters"],
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            trim: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number."],
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
            match: [
                /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address",
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes
patientSchema.index({ name: "text" });
patientSchema.index({ email: 1 });

module.exports = mongoose.model("Patient", patientSchema);