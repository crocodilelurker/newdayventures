import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Order } from '../lib/models/Order';


dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function clearOrders() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!);
        
        console.log("Clearing all orders to reset testing state...");
        const result = await Order.deleteMany({});
        
        console.log(`Successfully deleted ${result.deletedCount} orders.`);
        console.log("You can now start testing with a clean purchase history.");
        
    } catch (error) {
        console.error("Error clearing orders:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

clearOrders();
