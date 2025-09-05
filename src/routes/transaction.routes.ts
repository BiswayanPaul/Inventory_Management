import { Router } from "express";
import {
    getTransactions,
    addTransaction
} from "../controllers/transaction.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();



// Secured Routes
router.route("/").get(verifyJWT, getTransactions)
router.route("/").post(verifyJWT, addTransaction)

export default router;