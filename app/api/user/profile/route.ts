import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Admin } from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, email, currentPassword, newPassword } = await req.json();
        const userId = (session.user as any).id;
        const userRole = (session.user as any).role;

        await connectDB();
        let dbUser: any;
        if (userRole === "admin") {
            dbUser = await Admin.findById(userId).select("+password");
        } else {
            dbUser = await User.findById(userId).select("+password");
        }

        if (!dbUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (currentPassword && newPassword) {
            if (!dbUser.password) {
                return NextResponse.json({ message: "User has no password set" }, { status: 400 });
            }
            
            const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
            
            if (!isMatch) {
                return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
            }

            if (newPassword.length < 6) {
                return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
            }

            const salt = await bcrypt.genSalt(10);
            dbUser.password = await bcrypt.hash(newPassword, salt);
        }

        if (email && email.trim() !== "") {
            let existingUser;
            if (userRole === "admin") {
                existingUser = await Admin.findOne({ email: email.trim(), _id: { $ne: dbUser._id } });
            } else {
                existingUser = await User.findOne({ email: email.trim(), _id: { $ne: dbUser._id } });
            }

            if (existingUser) {
                return NextResponse.json({ message: "Email is already in use by another account" }, { status: 400 });
            }
            dbUser.email = email.trim();
        }

        if (name && name.trim() !== "") {
            dbUser.name = name.trim();
        }

        await dbUser.save();

        return NextResponse.json(
            { message: "Profile updated successfully", user: { name: dbUser.name, email: dbUser.email } },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
