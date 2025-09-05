import { Router } from "express";
import {
    addContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} from "../controllers/vendorOrCustomer.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();


// Secured Routes
router.route("/").get(verifyJWT, getContacts)
router.route("/:id").get(verifyJWT, getContactById)
router.route("/").post(verifyJWT, addContact)
router.route("/:id").put(verifyJWT, updateContact)
router.route("/:id").delete(verifyJWT, deleteContact)

export default router;