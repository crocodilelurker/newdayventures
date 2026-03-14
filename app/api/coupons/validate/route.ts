import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Coupon } from "@/lib/models/Coupon";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, cartItems } = body;

        if (!code) {
            return NextResponse.json({ message: "Coupon code is required." }, { status: 400 });
        }

        await dbConnect();
        
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return NextResponse.json({ message: "Invalid or inactive promo code." }, { status: 404 });
        }

        // Calculate discount. 
        // If applicableMaterials length > 0, it applies only to those specific courses.
        // Otherwise, it applies to the entire cart.
        let discountableAmount = 0;

        if (coupon.applicableMaterials && coupon.applicableMaterials.length > 0) {
            const applicableIds = coupon.applicableMaterials.map(id => id.toString());
            cartItems.forEach((item: any) => {
                if (applicableIds.includes(item.id)) {
                    discountableAmount += item.price;
                }
            });
            if (discountableAmount === 0) {
                 return NextResponse.json({ message: "This promo code is not applicable to any items in your cart." }, { status: 400 });
            }
        } else {
            // Applies to entire cart
            discountableAmount = cartItems.reduce((acc: number, item: any) => acc + item.price, 0);
        }

        const discountAmount = (discountableAmount * coupon.discountPercent) / 100;

        return NextResponse.json({ 
            message: "Coupon applied successfully!",
            discountPercent: coupon.discountPercent,
            discountAmount: discountAmount,
            couponId: coupon._id,
            code: coupon.code
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error validating coupon:", error);
        return NextResponse.json(
            { message: "Failed to validate coupon", error: error.message },
            { status: 500 }
        );
    }
}
