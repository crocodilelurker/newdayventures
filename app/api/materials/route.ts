import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const search = searchParams.get("search");

        await dbConnect();

        
        const query: any = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (type && type !== "All") {
            query.type = type;
        }

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const materials = await Material.find(query).sort({ rating: -1 }).select('-accessLink');

        return NextResponse.json(materials, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching materials:", error);
        return NextResponse.json(
            { message: "Failed to fetch materials", error: error.message },
            { status: 500 }
        );
    }
}
