import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Fetch user to ensure they exist
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 2. Fetch all orders tied to this user
        const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

        return NextResponse.json({
            user,
            orders
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin User Orders Fetch Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch user order history", error: error.message },
            { status: 500 }
        );
    }
}
