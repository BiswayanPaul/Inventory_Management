import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { getTransactionReport, getInventoryReport } from "../controllers/report.controller";

const router = Router();

router.get("/transactions", verifyJWT, getTransactionReport);
router.get("/inventory", verifyJWT, getInventoryReport);

export default router;
