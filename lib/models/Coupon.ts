import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountPercent: number;
    isActive: boolean;
    applicableMaterials?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountPercent: { type: Number, required: true, min: 1, max: 100 },
        isActive: { type: Boolean, default: true },
        applicableMaterials: [{ type: Schema.Types.ObjectId, ref: 'Material' }],
    },
    {
        timestamps: true,
    }
);

export const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
