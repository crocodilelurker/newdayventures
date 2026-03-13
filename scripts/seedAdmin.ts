import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config({ path: ".env.local" });
import { Admin } from "../lib/models/Admin";

async function seedAdmin() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for Admin Seeding...");

        const email = "admin123@gmail.com";
        const password = "admin123";

        
        const existingAdmin = await Admin.findOne({ email });
        
        if (existingAdmin) {
            console.log("Admin already exists. Skipping default seed.");
            process.exit(0);
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await Admin.create({
            email,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Successfully seeded default Admin: admin123@gmail.com / admin123");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
}

seedAdmin();
