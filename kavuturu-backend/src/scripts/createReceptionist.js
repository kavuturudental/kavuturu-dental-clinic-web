// src/scripts/createReceptionist.js

require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User");

const createReceptionist = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");

        const existingUser = await User.findOne({
            email: "receptionist@kavuturudental.com",
        });

        if (existingUser) {
            console.log("ℹ️ Receptionist already exists.");

            process.exit(0);
        }

        const receptionist = new User({
            name: "Receptionist",
            email: "receptionist@kavuturudental.com",
            password: "Reception@123",
            role: "receptionist",
            phone: "9876500000",
        });

        await receptionist.save();

        console.log("=======================================");
        console.log("✅ Receptionist Created Successfully");
        console.log("=======================================");
        console.log("Email    : receptionist@kavuturudental.com");
        console.log("Password : Reception@123");
        console.log("Role     : receptionist");
        console.log("=======================================");

        process.exit(0);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

createReceptionist();