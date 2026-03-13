import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Material } from '../lib/models/Material';

dotenv.config({ path: '.env.local' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const mats = await Material.find({});
    mats.forEach(m => {
        console.log(`Title: ${m.title}`);
        console.log(`Access Link: ${m.accessLink}`);
        console.log('---');
    });
    await mongoose.disconnect();
}
check();
