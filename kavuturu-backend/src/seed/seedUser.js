// src/seed/seedUser.js

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const { connectDatabase } = require("../config/database");

const seedUser = async () => {
    try {
        await connectDatabase();

        // 1. Doctor Account
        let doctor = await User.findOne({
            email: "doctor@kavuturudental.com",
        });

        if (!doctor) {
            doctor = await User.create({
                name: "Dr. K. Ravindra Babu",
                email: "doctor@kavuturudental.com",
                password: "Doctor@123",
                role: "doctor",
                phone: "9876543210",
            });
            console.log("✅ Doctor account created successfully.");
        } else {
            console.log("ℹ️ Doctor account already exists.");
        }

        // 2. Receptionist Account
        let receptionist = await User.findOne({
            email: "receptionist@kavuturudental.com",
        });

        if (!receptionist) {
            receptionist = await User.create({
                name: "Clinic Receptionist",
                email: "receptionist@kavuturudental.com",
                password: "Reception@123",
                role: "receptionist",
                phone: "9876500000",
            });
            console.log("✅ Receptionist account created successfully.");
        } else {
            console.log("ℹ️ Receptionist account already exists.");
        }

        console.log({
            doctor: { id: doctor._id, email: doctor.email, role: doctor.role },
            receptionist: { id: receptionist._id, email: receptionist.email, role: receptionist.role }
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUser();