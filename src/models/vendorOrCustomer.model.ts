import mongoose, { Schema, Document } from "mongoose";

export type CustomerVendorType = "customer" | "vendor";

export interface ICustomerVendor extends Document {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: CustomerVendorType;
    businessId: string;
}

const customerVendorSchema = new Schema<ICustomerVendor>(
    {
        name: { type: String, required: true, trim: true, index: true },
        phone: { type: String, required: false },
        email: { type: String, lowercase: true, trim: true, required: true },
        address: { type: String, lowercase: true, trim: true, required: true },
        type: { type: String, enum: ["customer", "vendor"], required: true },
        businessId: { type: String, required: true, index: true },
    },
    { timestamps: true }
);

customerVendorSchema.index({ businessId: 1, type: 1 });
customerVendorSchema.index({ name: "text" });
customerVendorSchema.index({ businessId: 1, email: 1 }, { unique: true, sparse: true });


customerVendorSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: Record<string, any>) => {
        if (ret._id) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
    },
});

export const CustomerVendor = mongoose.model<ICustomerVendor>(
    "CustomerVendor",
    customerVendorSchema
);
