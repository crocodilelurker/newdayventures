import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
        
        return NextResponse.json(users, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch users", error: error.message }, { status: 500 });
    }
}
