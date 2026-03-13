import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        
        const body = await req.json();
        const updatedMaterial = await Material.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        
        if (!updatedMaterial) {
            return NextResponse.json({ message: "Material not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Material updated successfully", material: updatedMaterial }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to update material", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        
        const deletedMaterial = await Material.findByIdAndDelete(id);
        
        if (!deletedMaterial) {
            return NextResponse.json({ message: "Material not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Material deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to delete material", error: error.message }, { status: 500 });
    }
}
