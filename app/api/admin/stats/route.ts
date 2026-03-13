import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        
        
        const totalMaterials = await Material.countDocuments();
        
        
        const orders = await Order.find({ paymentStatus: 'completed' }).populate('user', 'name email');
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalOrders = orders.length;

        
        const materialStats: any = {};
        
        
        const materialsList = await Material.find().select('title');
        materialsList.forEach(m => {
            materialStats[m._id.toString()] = {
                title: m.title,
                purchases: 0,
                buyers: []
            };
        });

        
        orders.forEach((order: any) => {
            order.items.forEach((item: any) => {
                const matId = item.material.toString();
                if (materialStats[matId]) {
                    materialStats[matId].purchases += 1;
                    
                    
                    if (order.user) {
                        const buyerExists = materialStats[matId].buyers.some((b: any) => b.email === order.user.email);
                        if (!buyerExists) {
                            materialStats[matId].buyers.push({
                                name: order.user.name,
                                email: order.user.email
                            });
                        }
                    }
                }
            });
        });

        return NextResponse.json({
            overview: {
                totalUsers,
                totalMaterials,
                totalRevenue,
                totalOrders
            },
            courseStats: Object.values(materialStats).filter((s:any) => s.purchases > 0)
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ message: "Failed to fetch stats", error: error.message }, { status: 500 });
    }
}
