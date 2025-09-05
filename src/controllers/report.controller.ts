import { Response } from "express";
import { AuthRequest } from "../utils/types";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Transaction } from "../models/transaction.model";
import { Product } from "../models/product.model";
import { ApiResponse } from "../utils/ApiResponse";


const getTransactionReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const { type, customerId, vendorId, fromDate, toDate, page = "1", limit = "50" } = req.query;

    const filter: Record<string, any> = { businessId };

    if (type && (type === "sale" || type === "purchase")) filter.type = type;
    if (customerId) filter.customerId = customerId;
    if (vendorId) filter.vendorId = vendorId;
    if (fromDate || toDate) filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate as string);
    if (toDate) filter.date.$lte = new Date(toDate as string);

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("customerId", "name")
        .populate("vendorId", "name")
        .populate("products.productId", "name price");

    const total = await Transaction.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, { transactions, total, page: pageNum, limit: limitNum }, "Transaction report fetched successfully"));
});


const getInventoryReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const { search, category, page = "1", limit = "50" } = req.query;

    const filter: Record<string, any> = { businessId };
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Product.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, { products, total, page: pageNum, limit: limitNum }, "Inventory report fetched successfully"));
});

export { getTransactionReport, getInventoryReport };
