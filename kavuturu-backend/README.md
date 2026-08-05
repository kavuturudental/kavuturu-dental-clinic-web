# Kavuturu Backend

Node.js & Express backend API service for Kavuturu Dental Clinic.

## Project Structure

```text
kavuturu-backend/
├── src/
│   ├── config/       # Environment & Database Configuration
│   ├── controllers/  # Route Handler Logic
│   ├── middleware/   # Custom Express Middleware (Auth, Error Handling)
│   ├── models/       # Database Schemas & Models
│   ├── routes/       # API Route Endpoints
│   ├── services/     # Business Logic & External Integrations
│   ├── validators/   # Request Validation Schemas
│   ├── utils/        # Utility Functions & Helpers
│   ├── uploads/      # Static File Uploads Directory
│   ├── seed/         # Database Seeding Scripts
│   ├── app.js        # Express App Initialization
│   └── server.js     # Server Startup & Cluster Entrypoint
├── .env              # Local Environment Variables
├── .env.example      # Sample Environment Variables
├── .gitignore        # Git Ignore Definitions
└── README.md         # Project Documentation
```
