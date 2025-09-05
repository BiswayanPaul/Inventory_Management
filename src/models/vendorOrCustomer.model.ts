import mongoose, { Schema, Document } from "mongoose";

export type CustomerVendorType = "customer" | "vendor";

export interface ICustomerVendor extends Document {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: CustomerVendorType;
    businessId: Schema.Types.ObjectId;
}

const customerVendorSchema = new Schema<ICustomerVendor>(
    {
        name: { type: String, required: true, trim: true, index: true },
        phone: { type: String },
        email: { type: String, lowercase: true, trim: true },
        address: { type: String },
        type: { type: String, enum: ["customer", "vendor"], required: true },
        businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    },
    { timestamps: true }
);


customerVendorSchema.index({ businessId: 1, type: 1 });


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
