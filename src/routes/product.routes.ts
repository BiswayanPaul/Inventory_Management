import { Router } from "express";
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock
} from "../controllers/product.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();


// Secured Routes
router.route("/").post(verifyJWT, addProduct)
router.route("/").get(verifyJWT, getProducts)
router.route("/:id").get(verifyJWT, getProductById)
router.route("/:id").put(verifyJWT, updateProduct)
router.route("/:id").delete(verifyJWT, deleteProduct)
router.route("/:id/adjust-stock").put(verifyJWT, adjustStock)

export default router;