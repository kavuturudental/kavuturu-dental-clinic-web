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
            monSat: {
                type: String,
                required: true,
                default: "9:30 AM – 9:00 PM",
            },
            monFri: {
                type: String,
                default: "9:30 AM – 9:00 PM",
            },
            saturday: {
                type: String,
                default: "9:30 AM – 9:00 PM",
            },
            sunday: {
                type: String,
                required: true,
                default: "10:00 AM – 1:30 PM",
            },
        },
        socialLinks: {
            facebook: {
                type: String,
                trim: true,
                default: "",
            },
            instagram: {
                type: String,
                trim: true,
                default: "",
            },
            whatsapp: {
                type: String,
                trim: true,
                default: "",
            },
            callPhone: {
                type: String,
                trim: true,
                default: "",
            },
            youtube: {
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
