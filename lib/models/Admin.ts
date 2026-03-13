import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true,
            lowercase: true 
        },
        password: { 
            type: String, 
            required: true,
            select: false 
        },
        role: {
            type: String,
            default: 'admin',
        }
    },
    {
        timestamps: true,
    }
);

export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
