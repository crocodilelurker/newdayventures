import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
    material: mongoose.Types.ObjectId;
    price: number;
    title: string;
    type: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true,
    },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
