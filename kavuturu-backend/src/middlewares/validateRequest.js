// src/middlewares/validateRequest.js

const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        // Replace req.body with validated/sanitized data
        req.body = result.data;

        next();
    };
};

module.exports = validateRequest;