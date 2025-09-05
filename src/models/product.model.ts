import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    businessId: string;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true, index: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 },
        category: { type: String, required: true, trim: true, index: true },
        businessId: { type: String, required: true },
    },
    { timestamps: true }
);


productSchema.index({ businessId: 1, category: 1 });


productSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: Record<string, any>) => {
        if (ret._id) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
    },
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
