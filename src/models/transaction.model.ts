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
    businessId: string;
}

const transactionSchema = new Schema<ITransaction>(
    {
        type: { type: String, enum: ["sale", "purchase"], required: true },
        customerId: { type: Schema.Types.ObjectId, ref: "CustomerVendor", required: false },
        vendorId: { type: Schema.Types.ObjectId, ref: "CustomerVendor", required: false },
        products: {
            type: [
                {
                    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                    quantity: { type: Number, required: true, min: 1 },
                    price: { type: Number, required: true, min: 0 },
                }
            ],
            required: true,
            validate: [(val: any[]) => val.length > 0, 'Transaction must include at least one product']
        },
        totalAmount: { type: Number, required: true, min: 0, default: 0 },
        date: { type: Date, required: true, default: Date.now },
        businessId: { type: String, required: true },
    },
    { timestamps: true }
);


transactionSchema.index({ businessId: 1, date: -1, type: 1 });


transactionSchema.pre("validate", function (next) {
    const transaction = this as ITransaction;

    if (!transaction.products || transaction.products.length === 0) {
        transaction.totalAmount = 0;
    } else {

        transaction.totalAmount = transaction.products.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );
    }

    next();
});


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
