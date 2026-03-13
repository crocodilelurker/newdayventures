import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Material } from '../lib/models/Material';


dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const allMaterials = [
    {
        title: "Advanced Data Structures & Algorithms Mastery",
        instructor: "Dr. Angela Yu, Coding Master",
        type: "Course Bundle",
        price: 529,
        rating: 4.8,
        reviews: 328,
        students: 12504,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
        category: "engineering",
        description: "Master the most critical data structures and algorithms required to ace top-tier coding interviews. This comprehensive bundle goes beyond theory, giving you practical implementations, pattern recognition techniques, and deep-dive explanations for complex topics.",
        highlights: [
            "120+ High-quality video explanations",
            "50+ Interactive coding exercises",
            "Comprehensive PDF notes for offline study",
            "Lifetime access & free updates"
        ],
        syllabus: [
            "Arrays, Strings & 2D Matrices",
            "HashMaps & Sets Deep Dive",
            "Linked Lists & Fast/Slow Pointers",
            "Stacks, Queues & Monotonic Stacks",
            "Trees, Tries & Graph Algorithms",
            "Dynamic Programming Patterns",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-1/edit"
    },
    {
        title: "Complete System Design Architecture Guide",
        instructor: "Hussein Nasser",
        type: "PDF Guide",
        price: 499,
        rating: 4.9,
        reviews: 840,
        students: 34201,
        image: "https://images.unsplash.com/photo-1454165833767-027ffcb99c17?q=80&w=1000",
        category: "engineering",
        description: "A comprehensive PDF guide to designing scalable, distributed backend architectures. Learn about load balancing, caching, databases, and microservices.",
        highlights: [
            "100+ pages of detailed architecture diagrams",
            "Real-world case studies (Netflix, Uber, Twitter)",
            "Downloadable PDF format",
            "Lifetime access"
        ],
        syllabus: [
            "Scaling from Zero to Millions",
            "Load Balancing & Consistent Hashing",
            "Caching Strategies (Redis, Memcached)",
            "Database Sharding & Replication",
            "Message Queues (Kafka, RabbitMQ)",
            "Microservices Architecture",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-2/edit"
    },
    {
        title: "Machine Learning Math Essentials Bootcamp",
        instructor: "Krish Naik",
        type: "Study Notes",
        price: 399,
        rating: 4.7,
        reviews: 145,
        students: 8904,
        image: "https://images.unsplash.com/photo-1551288049-bbda38a8f79f?q=80&w=1000",
        category: "data-science",
        description: "Master the linear algebra, calculus, and probability theory required to truly understand how machine learning models work under the hood.",
        highlights: [
            "Clear, concise mathematical derivations",
            "Python code examples for math concepts",
            "Printable study sheets",
            "Lifetime access"
        ],
        syllabus: [
            "Linear Algebra Foundations",
            "Matrix Operations & Eigenvalues",
            "Calculus: Derivatives & Gradients",
            "Probability & Statistics",
            "Optimization Algorithms",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-3/edit"
    },
    {
        title: "React & Next.js Full Stack Web Development",
        instructor: "Maximilian Schwarzmüller",
        type: "Course",
        price: 549,
        rating: 4.6,
        reviews: 1200,
        students: 45200,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
        category: "engineering",
        description: "Build production-ready, full-stack React and Next.js applications from scratch. Covers App Router, Server Actions, Authentication, and Database integration.",
        highlights: [
            "40+ hours of on-demand video",
            "Build 4 real-world projects",
            "Source code included",
            "Certificate of completion"
        ],
        syllabus: [
            "React Fundamentals Refresher",
            "Next.js Routing & Layouts",
            "Data Fetching & Server Actions",
            "Authentication with NextAuth",
            "Database Integration (MongoDB/Prisma)",
            "Deployment on Vercel",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-4/edit"
    },
    {
        title: "Business Strategy Frameworks PDF",
        instructor: "HBR Group",
        type: "PDF Guide",
        price: 299,
        rating: 4.7,
        reviews: 80,
        students: 2100,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
        category: "business",
        description: "A collection of powerful business strategy frameworks used by top consulting firms to analyze markets, competitors, and growth opportunities.",
        highlights: [
            "20+ industry-standard frameworks",
            "Templates and worksheets included",
            "Downloadable PDF format",
            "Lifetime access"
        ],
        syllabus: [
            "SWOT & PESTLE Analysis",
            "Porter's Five Forces",
            "The BCG Matrix",
            "Value Chain Analysis",
            "Blue Ocean Strategy",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-5/edit"
    },
    {
        title: "UX/UI Design Principles Sheet",
        instructor: "Gary Simon",
        type: "Study Notes",
        price: 199,
        rating: 4.6,
        reviews: 95,
        students: 1800,
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000",
        category: "design",
        description: "A visual cheat sheet covering fundamental UX/UI design principles, typography, color theory, and layout rules for creating stunning interfaces.",
        highlights: [
            "High-resolution visual examples",
            "Figma file included",
            "Printable cheat sheet format",
            "Lifetime access"
        ],
        syllabus: [
            "Visual Hierarchy & Layout",
            "Color Theory & Accessibility",
            "Typography Best Practices",
            "UI Component Design",
            "Prototyping Basics",
        ],
        accessLink: "https://docs.google.com/document/d/1-example-access-link-6/edit"
    }
];

async function seedDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB.");

        console.log("Clearing existing materials...");
        await Material.deleteMany({});
        console.log("Cleared existing materials.");

        console.log("Inserting mock materials...");
        const inserted = await Material.insertMany(allMaterials);
        console.log(`Successfully inserted ${inserted.length} materials.`);
        
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
        process.exit();
    }
}

seedDB();
