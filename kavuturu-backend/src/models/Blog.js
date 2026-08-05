// src/models/Blog.js

const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
});

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            default: "Dental Care",
        },

        readTime: {
            type: String,
            required: true,
            default: "5 min read",
        },

        summary: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        public_id: {
            type: String,
            default: "",
        },

        blogDate: {
            type: Date,
            default: Date.now,
        },

        faqs: [faqSchema],

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

module.exports = mongoose.model("Blog", blogSchema);
