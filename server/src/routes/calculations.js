import { Router } from "express";

import {
  clearCalculations,
  createCalculation,
  deleteCalculation,
  getCalculations
} from "../controllers/calculationController.js";

const router = Router();

router.get("/", getCalculations);
router.post("/", createCalculation);
router.delete("/:id", deleteCalculation);
router.delete("/", clearCalculations);

export default router;
