import { Response } from "express";
import { AuthRequest } from "../utils/types";
import ApiError from "../utils/ApiError";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";


const addProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized")
    }
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const businessId = user?.businessId;

        if (!businessId) throw new ApiError(400, "User does not belong to any business");


        const { name, description, price, stock, category } = req.body;
        if (!name || !price || !stock || !category) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            businessId
        })

        return res
            .status(201)
            .json(new ApiResponse(201, product, "Product Added Successfully"))

    }
    catch (err) {
        throw new ApiError(500, "Cannot add product, Try again")
    }
})


const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const products = await Product.find({ businessId });
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});



const getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const product = await Product.findOne({ _id: id, businessId: req.user.businessId });

    if (!product) throw new ApiError(404, "Product not found");

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
})




const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findOne({ _id: id, businessId: req.user.businessId });
    if (!product) throw new ApiError(404, "Product not found");

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category.trim();

    await product.save();
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});




const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, businessId: req.user.businessId });

    if (!product) throw new ApiError(404, "Product not found");

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
})




const adjustStock = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) throw new ApiError(400, "Quantity is required");

    const product = await Product.findOne({ _id: id, businessId: req.user.businessId });
    if (!product) throw new ApiError(404, "Product not found");

    const newStock = product.stock + Number(quantity);
    if (newStock < 0) throw new ApiError(400, "Stock cannot be negative");

    product.stock = newStock;
    await product.save();

    return res.status(200).json(new ApiResponse(200, product, "Product stock updated successfully"));
});

export {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock
};

