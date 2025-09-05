import { Response } from "express";
import { AuthRequest } from "../utils/types";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Transaction } from "../models/transaction.model";
import { Product } from "../models/product.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { CustomerVendor } from "../models/vendorOrCustomer.model";


interface TransactionItem {
    productId: string;
    quantity: number;
}


const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const { type, startDate, endDate, page = "1", limit = "20" } = req.query;

    const filter: Record<string, any> = { businessId };
    if (type && (type === "sale" || type === "purchase")) filter.type = type;
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate.toString());
    if (endDate) filter.date.$lte = new Date(endDate.toString());

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("customerId vendorId products.productId");

    const total = await Transaction.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { transactions, total, page: pageNum, limit: limitNum }, "Transactions fetched successfully")
    );
});


const addTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const { type, customerId, vendorId, products }: { type: "sale" | "purchase"; customerId?: string; vendorId?: string; products: TransactionItem[] } = req.body;

    if (!type || !["sale", "purchase"].includes(type)) {
        throw new ApiError(400, "Type must be either 'sale' or 'purchase'");
    }
    if (type === "sale") {
        if (!customerId) throw new ApiError(400, "customerId is required for a sale transaction");

        const customer = await CustomerVendor.findById(customerId);
        if (!customer || customer.type !== "customer") {
            throw new ApiError(400, "Invalid customerId: must refer to a valid customer");
        }
    }

    if (type === "purchase") {
        if (!vendorId) throw new ApiError(400, "vendorId is required for a purchase transaction");

        const vendor = await CustomerVendor.findById(vendorId);
        if (!vendor || vendor.type !== "vendor") {
            throw new ApiError(400, "Invalid vendorId: must refer to a valid vendor");
        }
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        throw new ApiError(400, "Transaction must include at least one product");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const productIds = products.map(p => p.productId);
        const productDocs = await Product.find({ _id: { $in: productIds }, businessId }).session(session);

        if (productDocs.length !== productIds.length) {
            const missingIds = productIds.filter(id => !productDocs.find(p => p.id === id));
            throw new ApiError(404, `Products not found: ${missingIds.join(", ")}`);
        }


        const transactionProducts = products.map(item => {
            const product = productDocs.find(p => p.id === item.productId)!;

            if (type === "sale" && product.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for product ${product.name}`);
            }


            product.stock += type === "sale" ? -item.quantity : item.quantity;

            return {
                product,
                quantity: item.quantity,
                price: product.price,
            };
        });


        for (const tp of transactionProducts) {
            await tp.product.save({ session });
        }


        const transaction = await Transaction.create(
            [
                {
                    type,
                    customerId: type === "sale" ? customerId : undefined,
                    vendorId: type === "purchase" ? vendorId : undefined,
                    products: transactionProducts.map(p => ({
                        productId: p.product.id,
                        quantity: p.quantity,
                        price: p.price,
                    })),
                    businessId,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(new ApiResponse(201, transaction[0], "Transaction recorded successfully"));
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
});


export { getTransactions, addTransaction };
