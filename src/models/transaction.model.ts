import mongoose, { Schema, Document, Types } from "mongoose";

export type TransactionType = "sale" | "purchase";

export interface ITransaction extends Document {
    type: TransactionType;
    customerId?: Types.ObjectId;
    vendorId?: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    date: Date;
    businessId: Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>(
    {
        type: { type: String, enum: ["sale", "purchase"], required: true },
        customerId: { type: Schema.Types.ObjectId, ref: "CustomerVendor" },
        vendorId: { type: Schema.Types.ObjectId, ref: "CustomerVendor" },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        totalAmount: { type: Number, required: true, min: 0 },
        date: { type: Date, required: true, default: Date.now },
        businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    },
    { timestamps: true }
);


transactionSchema.index({ businessId: 1, date: -1, type: 1 });


transactionSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: Record<string, any>) => {
        if (ret._id) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
    },
});

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
