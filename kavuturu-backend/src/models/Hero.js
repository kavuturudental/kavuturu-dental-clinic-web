// src/models/Hero.js

const mongoose = require("mongoose");

const heroStatSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        subtitle: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const heroSchema = new mongoose.Schema(
    {
        trustBadge: {
            type: String,
            required: true,
            trim: true,
            default: "EXPERT CARE. ADVANCED TECHNOLOGY.",
        },

        heading: {
            type: String,
            required: true,
            trim: true,
            default: "Advanced Laser & Implant Dentistry",
        },

        accentSubheading: {
            type: String,
            required: true,
            trim: true,
            default: "for a Healthier, Happier Smile",
        },

        description: {
            type: String,
            required: true,
            trim: true,
            default:
                "Painless treatments. Beautiful smiles.\nPersonalized care for you and your family.",
        },

        stats: {
            type: [heroStatSchema],
            default: [
                {
                    value: "25,000+",
                    title: "Happy Patients",
                    subtitle: "",
                },
                {
                    value: "20,000+",
                    title: "Root Canal Treatments",
                    subtitle: "",
                },
                {
                    value: "10+",
                    title: "Years Experience",
                    subtitle: "",
                },
                {
                    value: "4.9",
                    title: "Google Rating",
                    subtitle: "",
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Hero = mongoose.model("Hero", heroSchema);

console.log("Hero Stats Schema:");
console.log(Object.keys(Hero.schema.path("stats").schema.paths));

module.exports = Hero;