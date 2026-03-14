import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMaterial extends Document {
    title: string;
    instructor: string;
    type: 'Course' | 'Course Bundle' | 'PDF Guide' | 'Study Notes';
    price: number;
    rating: number;
    reviews: number;
    students: number;
    image: string;
    category: string;
    description: string;
    highlights: string[];
    ratings?: { userId: mongoose.Types.ObjectId; score: number }[];
    syllabus: string[];
    accessLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
    {
        title: { type: String, required: true },
        instructor: { type: String, required: true },
        type: { 
            type: String, 
            enum: ['Course', 'Course Bundle', 'PDF Guide', 'Study Notes'],
            required: true 
        },
        price: { type: Number, required: true },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        students: { type: Number, default: 0 },
        image: { type: String, required: true },
        category: { type: String, required: true, index: true },
        description: { type: String, required: true },
        highlights: [{ type: String }],
        syllabus: [{ type: String }],
        accessLink: { type: String, default: "" },
        ratings: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                score: { type: Number, required: true, min: 1, max: 5 }
            }
        ]
    },
    {
        timestamps: true,
    }
);
MaterialSchema.virtual('formattedPrice').get(function() {
    return `₹${this.price.toLocaleString('en-IN')}`;
});

export const Material: Model<IMaterial> = mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
