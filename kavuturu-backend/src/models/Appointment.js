// src/models/Appointment.js

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: [true, "Patient is required"],
        },

        appointmentNumber: {
            type: String,
            required: [true, "Appointment number is required"],
            unique: true,
            trim: true,
        },

        appointmentDate: {
            type: Date,
            required: [true, "Appointment date is required"],
        },

        appointmentTime: {
            type: String,
            required: [true, "Appointment time is required"],
            trim: true,
        },

        treatment: {
            type: String,
            required: [true, "Treatment is required"],
            trim: true,
            maxlength: [100, "Treatment cannot exceed 100 characters"],
        },

        message: {
            type: String,
            trim: true,
            maxlength: [1000, "Message cannot exceed 1000 characters"],
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
            default: "Receptionist",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Checked In",
                "Completed",
                "Cancelled",
                "Rescheduled",
                "Rejected",
            ],
            default: "Confirmed",
        },

        checkedInAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        rescheduledAt: {
            type: Date,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ appointmentTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ patient: 1 });

appointmentSchema.index({
    appointmentDate: 1,
    appointmentTime: 1,
});

module.exports = mongoose.model("Appointment", appointmentSchema);