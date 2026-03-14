import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Coupon } from "@/lib/models/Coupon";
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

        const { items, totalAmount, couponCode } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "Order must contain at least one item" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Validate server-side total
        let calculatedTotal = items.reduce((acc: number, item: any) => acc + item.price, 0);

        if (couponCode) {
             const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
             if (coupon) {
                 let discountableAmount = 0;
                 if (coupon.applicableMaterials && coupon.applicableMaterials.length > 0) {
                     const applicableIds = coupon.applicableMaterials.map(id => id.toString());
                     items.forEach((item: any) => {
                         if (applicableIds.includes(item.id)) discountableAmount += item.price;
                     });
                 } else {
                     discountableAmount = calculatedTotal;
                 }
                 const discountAmount = (discountableAmount * coupon.discountPercent) / 100;
                 calculatedTotal = Math.max(0, calculatedTotal - discountAmount);
             }
        }

        const orderItems = items.map((item: any) => ({
            material: item.id,
            price: item.price,
            title: item.title,
            type: item.type,
        }));

        const newOrder = await Order.create({
            user: (session.user as any).id,
            items: orderItems,
            totalAmount: calculatedTotal, // Use server-calculated total
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
