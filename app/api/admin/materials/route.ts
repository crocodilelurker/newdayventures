import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const materials = await Material.find().sort({ createdAt: -1 });
        return NextResponse.json(materials, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch materials", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        
        const body = await req.json();
        const newMaterial = await Material.create(body);
        
        return NextResponse.json({ message: "Material created successfully", material: newMaterial }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to create material", error: error.message }, { status: 500 });
    }
}
