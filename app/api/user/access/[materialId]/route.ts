import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Material } from "@/lib/models/Material";

export async function GET(req: Request, { params }: { params: Promise<{ materialId: string }> }) {
    try {
        const { materialId } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized: Please log in." }, { status: 401 });
        }

        await dbConnect();

        // Check if user is an admin (Admins always get access)
        const isAdmin = (session.user as any).role === "admin";
        
        // If not admin, check if user has purchased this material
        let hasAccess = isAdmin;

        if (!isAdmin) {
            const hasPurchased = await Order.findOne({
                user: (session.user as any).id,
                "items.material": materialId,
                paymentStatus: { $in: ["completed", "Completed"] }
            });

            if (hasPurchased) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return NextResponse.json({ message: "Forbidden: You have not purchased this material." }, { status: 403 });
        }

        // Fetch material to get the accessLink
        const material = await Material.findById(materialId).select('accessLink title');

        if (!material) {
            return NextResponse.json({ message: "Material not found" }, { status: 404 });
        }

        if (!material.accessLink) {
            return NextResponse.json({ message: "No access link has been configured for this material yet." }, { status: 404 });
        }

        return NextResponse.json({ 
            accessLink: material.accessLink,
            title: material.title
        }, { status: 200 });

    } catch (error: any) {
        console.error("Access Link Fetch Error:", error);
        return NextResponse.json(
            { message: "Failed to verify access", error: error.message },
            { status: 500 }
        );
    }
}
