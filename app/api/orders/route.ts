import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in to complete checkout." },
                { status: 401 }
            );
        }

        const { items, totalAmount } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "Order must contain at least one item" },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const orderItems = items.map((item: any) => ({
            material: item.id,
            price: item.price,
            title: item.title,
            type: item.type,
        }));

        const newOrder = await Order.create({
            user: (session.user as any).id,
            items: orderItems,
            totalAmount,
            paymentStatus: "completed", 
        });

        return NextResponse.json(
            {
                message: "Order placed successfully",
                orderId: newOrder._id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { message: "An error occurred during checkout", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
        }

        await dbConnect();

        const orders = await Order.find({ user: (session.user as any).id }).sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
        console.error("Order fetching error:", error);
        return NextResponse.json(
            { message: "Failed to fetch orders", error: error.message },
            { status: 500 }
        );
    }
}
