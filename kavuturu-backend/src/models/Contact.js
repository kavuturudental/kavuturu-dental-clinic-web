// src/models/Contact.js

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: [true, "Clinic Address is required"],
            trim: true,
        },
        primaryPhone: {
            type: String,
            required: [true, "Primary Phone Number is required"],
            trim: true,
        },
        secondaryPhone: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: [true, "Email Address is required"],
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
        },
        mapsLink: {
            type: String,
            required: [true, "Google Maps Link is required"],
            trim: true,
        },
        timings: {
            monFri: {
                type: String,
                required: true,
                default: "9:00 AM – 8:00 PM",
            },
            saturday: {
                type: String,
                required: true,
                default: "9:00 AM – 6:00 PM",
            },
            sunday: {
                type: String,
                required: true,
                default: "Closed",
            },
        },
        socialLinks: {
            instagram: {
                type: String,
                trim: true,
                default: "",
            },
            facebook: {
                type: String,
                trim: true,
                default: "",
            },
            whatsapp: {
                type: String,
                trim: true,
                default: "",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Contact", contactSchema);
