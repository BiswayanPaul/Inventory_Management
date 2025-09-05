import mongoose, { Schema, Document } from "mongoose";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";


export interface IUser extends Document {
    _id: Schema.Types.ObjectId,
    email: string;
    fullname: string;
    password: string;
    businessId: string;
    refreshToken?: string;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        fullname: { type: String, required: true, trim: true, index: true },
        password: { type: String, required: [true, "Password is required"] },
        businessId: { type: String, required: true },
        refreshToken: { type: String },
    },
    { timestamps: true }
);


userSchema.index({ businessId: 1 });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});


userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};


const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET!;


userSchema.methods.generateAccessToken = function () {
    // console.log({ ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET })
    try {
        return jwt.sign(
            { _id: this._id.toString(), email: this.email, fullname: this.fullname },
            ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" } as SignOptions
        );
    } catch (err) {
        throw new Error("Failed to generate access token");
    }
};

userSchema.methods.generateRefreshToken = function () {
    try {
        return jwt.sign({ _id: this._id.toString() },
            REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } as SignOptions
        );
    } catch (err) {
        throw new Error("Failed to generate refresh token");
    }
};

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret: Record<string, any>) => {
        if (ret._id) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
        if (ret.password) {
            delete ret.password;
        }
    },
});


export const User = mongoose.model<IUser>("User", userSchema);
