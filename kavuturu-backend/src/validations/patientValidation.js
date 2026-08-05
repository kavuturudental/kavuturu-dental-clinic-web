// src/validations/patientValidation.js

const { z } = require("zod");

const patientSchema = z.object({
    name: z
        .string({
            required_error: "Patient name is required",
        })
        .trim()
        .min(2, "Patient name must be at least 2 characters")
        .max(100, "Patient name cannot exceed 100 characters"),

    phone: z
        .string({
            required_error: "Phone number is required",
        })
        .trim()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .optional()
        .or(z.literal("")),
});

module.exports = {
    patientSchema,
};