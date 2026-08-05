// src/validations/appointmentValidation.js

const { z } = require("zod");

const appointmentSchema = z.object({
    name: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    patientName: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    phoneNumber: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    email: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    appointmentDate: z
        .string()
        .optional()
        .or(z.literal("")),

    preferredDate: z
        .string()
        .optional()
        .or(z.literal("")),

    appointmentTime: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    preferredTime: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    treatment: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    bookingSource: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    message: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    status: z
        .string()
        .optional(),
});

module.exports = {
    appointmentSchema,
};