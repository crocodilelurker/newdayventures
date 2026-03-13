import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await dbConnect();

        const material = await Material.findById(id).select('-accessLink');

        if (!material) {
            return NextResponse.json(
                { message: "Material not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(material, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching material by ID:", error);
        return NextResponse.json(
            { message: "Failed to fetch material", error: error.message },
            { status: 500 }
        );
    }
}
