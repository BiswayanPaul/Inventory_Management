import { Response } from "express";
import { AuthRequest } from "../utils/types";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { CustomerVendor } from "../models/vendorOrCustomer.model";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";


const addContact = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const userId = req.user._id;
    const user = await User.findById(userId);
    const businessId = user?.businessId;

    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    let { name, phone, email, address, type } = req.body;

    if (!name || !type || !email || !address) {
        throw new ApiError(400, "All required fields (name, type, email, address) must be provided");
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    address = address.trim().toLowerCase();
    phone = phone?.trim();

    if (!["customer", "vendor"].includes(type)) {
        throw new ApiError(400, "Type must be either 'customer' or 'vendor'");
    }

    try {
        const contact = await CustomerVendor.create({
            name,
            phone,
            email,
            address,
            type,
            businessId
        });
        return res.status(201).json(new ApiResponse(201, contact, `${type} added successfully`));
    } catch (err: unknown) {
        if (err instanceof Error && "code" in err && (err as any).code === 11000) {
            throw new ApiError(400, "Email already exists for this business");
        }
        throw err;
    }
});


const getContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const businessId = req.user.businessId;
    if (!businessId) throw new ApiError(400, "User does not belong to any business");

    const { type, search, page = "1", limit = "20" } = req.query;

    const filter: Record<string, any> = { businessId };
    if (type && (type === "customer" || type === "vendor")) filter.type = type;

    let contactsQuery;
    if (search) {

        contactsQuery = CustomerVendor.find({ ...filter, $text: { $search: search.toString() } });
    } else {
        contactsQuery = CustomerVendor.find(filter);
    }


    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    const contacts = await contactsQuery.skip(skip).limit(limitNum);
    const total = await CustomerVendor.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, { contacts, total, page: pageNum, limit: limitNum }, "Contacts fetched successfully"));
});


const getContactById = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const contact = await CustomerVendor.findOne({ _id: id, businessId: req.user.businessId });

    if (!contact) throw new ApiError(404, "Contact not found");

    return res.status(200).json(new ApiResponse(200, contact, "Contact fetched successfully"));
});


const updateContact = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    let { name, phone, email, address, type } = req.body;

    const contact = await CustomerVendor.findOne({ _id: id, businessId: req.user.businessId });
    if (!contact) throw new ApiError(404, "Contact not found");

    if (name) contact.name = name.trim();
    if (phone) contact.phone = phone.trim();
    if (email) contact.email = email.trim().toLowerCase();
    if (address) contact.address = address.trim().toLowerCase();
    if (type && (type === "customer" || type === "vendor")) contact.type = type;

    try {
        await contact.save();
        return res.status(200).json(new ApiResponse(200, contact, "Contact updated successfully"));
    } catch (err: any) {
        if (err instanceof Error && "code" in err && (err as any).code === 11000) {
            throw new ApiError(400, "Email already exists for this business");
        }
        throw err;
    }
});


const deleteContact = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const { id } = req.params;
    const contact = await CustomerVendor.findOneAndDelete({ _id: id, businessId: req.user.businessId });

    if (!contact) throw new ApiError(404, "Contact not found");

    return res.status(200).json(new ApiResponse(200, {}, "Contact deleted successfully"));
});

export {
    addContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};
