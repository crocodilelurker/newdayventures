import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Material } from "@/lib/models/Material";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Fetch material to ensure it exists
        const material = await Material.findById(id);
        
        if (!material) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        // 2. Fetch all orders that contain this material and are completed
        const orders = await Order.find({ 
            "items.material": id,
            paymentStatus: { $in: ["completed", "Completed"] }
        }).populate('user', 'name email');

        return NextResponse.json({
            material,
            buyers: orders.map(order => ({
                orderId: order._id,
                user: order.user,
                purchaseDate: order.createdAt,
                price: order.items.find((item: any) => item.material.toString() === id)?.price
            }))
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin Course Buyers Fetch Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch course buyers", error: error.message },
            { status: 500 }
        );
    }
}
