// src/models/AppointmentRequest.js

const mongoose = require("mongoose");

const appointmentRequestSchema = new mongoose.Schema(
    {
        patientName: {
            type: String,
            required: [true, "Patient name is required"],
            trim: true,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            default: "",
        },

        treatment: {
            type: String,
            required: [true, "Treatment is required"],
            trim: true,
        },

        preferredDate: {
            type: Date,
            required: [true, "Preferred date is required"],
        },

        preferredTime: {
            type: String,
            required: [true, "Preferred time is required"],
            trim: true,
        },

        message: {
            type: String,
            trim: true,
            default: "",
        },

        bookingSource: {
            type: String,
            enum: [
                "Receptionist",
                "Doctor",
                "Phone Call",
                "Walk-in",
                "Email",
                "Website",
            ],
            default: "Website",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Rescheduled",
            ],
            default: "Pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AppointmentRequest",
    appointmentRequestSchema
);