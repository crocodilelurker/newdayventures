import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Coupon } from "@/lib/models/Coupon";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { isActive } = body;

        await dbConnect();
        
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedCoupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCoupon, { status: 200 });
    } catch (error: any) {
        console.error("Error updating coupon:", error);
        return NextResponse.json(
            { message: "Failed to update coupon", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        
        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json(
            { message: "Failed to delete coupon", error: error.message },
            { status: 500 }
        );
    }
}
