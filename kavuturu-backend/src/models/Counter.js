// src/models/Counter.js

const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        sequence: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


module.exports = mongoose.model("Counter", counterSchema);