const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const mats = await db.collection('materials').find({}).toArray();
        for (const m of mats) {
            const cleanCategory = m.category.replace(/[^\x20-\x7E]/g, '').trim();
            const cleanType = m.type.replace(/[^\x20-\x7E]/g, '').trim();
            await db.collection('materials').updateOne(
                { _id: m._id },
                { $set: { category: cleanCategory, type: cleanType } }
            );
            console.log('Fixed: ' + m.title + ' | Cat: [' + cleanCategory + '] | Type: [' + cleanType + ']');
        }
        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixData();
