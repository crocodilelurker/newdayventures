import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Coupon } from "@/lib/models/Coupon";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return NextResponse.json(coupons, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json(
            { message: "Failed to fetch coupons", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        
        await dbConnect();
        const newCoupon = await Coupon.create(body);

        return NextResponse.json(newCoupon, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "A coupon with this code already exists." },
                { status: 400 }
            );
        }
        console.error("Error creating coupon:", error);
        return NextResponse.json(
            { message: "Failed to create coupon", error: error.message },
            { status: 500 }
        );
    }
}
