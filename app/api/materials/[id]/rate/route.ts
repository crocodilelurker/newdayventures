import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { Material } from "@/lib/models/Material";
import mongoose from "mongoose";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { score } = body;

        if (!score || typeof score !== 'number' || score < 1 || score > 5) {
            return NextResponse.json({ message: "Invalid rating score. Must be between 1 and 5." }, { status: 400 });
        }

        await dbConnect();

        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json({ message: "Material not found" }, { status: 404 });
        }

        const userId = (session.user as any).id;
        
        // Check if user already rated
        if (!material.ratings) {
            material.ratings = [];
        }
        
        const existingRatingIndex = material.ratings.findIndex(
            (r: any) => r.userId.toString() === userId
        );

        if (existingRatingIndex !== -1) {
            // Update existing rating
            material.ratings[existingRatingIndex].score = score;
        } else {
            // Add new rating
            material.ratings.push({ userId, score } as any);
        }

        // Calculate new average rating
        const totalRatings = material.ratings.length;
        const sumRatings = material.ratings.reduce((acc: number, curr: any) => acc + curr.score, 0);
        const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

        material.rating = Number(averageRating);
        material.reviews = totalRatings;

        await material.save();

        return NextResponse.json({ 
            message: "Rating submitted successfully",
            rating: material.rating,
            reviews: material.reviews
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error submitting rating:", error);
        return NextResponse.json(
            { message: "Failed to submit rating", error: error.message },
            { status: 500 }
        );
    }
}
