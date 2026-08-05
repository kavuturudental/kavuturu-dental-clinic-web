// src/middlewares/roleMiddleware.js

/**
 * @desc    Role-Based Authorization Middleware
 * @param   {...String} roles
 * @access  Private
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        // Check user role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource.",
            });
        }

        next();
    };
};

module.exports = authorizeRoles;