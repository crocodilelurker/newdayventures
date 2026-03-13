import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Material } from '../lib/models/Material';


dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const customMaterial = {
    title: "Premium Full-Stack Engineering Blueprint 2026",
    instructor: "Elite Venture Team",
    type: "Course",
    price: 999,
    rating: 5.0,
    reviews: 1,
    students: 1,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
    category: "engineering",
    description: "The ultimate guide to building modern, secure, and scalable high-performance applications. Includes access to our private resource vault.",
    highlights: [
        "Exclusive 2026 architecture patterns",
        "Secret backend vault access",
        "Priority support",
        "Premium certification"
    ],
    syllabus: [
        "Advanced Agentic Workflows",
        "High-Speed Distributed Systems",
        "Next-Gen Security Models",
        "Accessing the Private Resource Vault"
    ],
    accessLink: "https://newdayventures.notion.site/Premium-Full-Stack-Engineering-Blueprint-2026-Access-Vault-5424656373284095840190059158004f"
};

async function seedCustom() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);

        console.log("Inserting premium course with secret link...");
        const result = await Material.create(customMaterial);

        console.log(`Successfully seeded material: ${result.title}`);
        console.log(`Resource Access Link: ${result.accessLink}`);

    } catch (error) {
        console.error("Error seeding custom course:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

seedCustom();
