import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  createManualRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/", protect, registerForEvent);
router.post("/manual", protect, createManualRegistration);
router.get("/my", protect, getMyRegistrations);
router.get("/event/:eventId", protect, getEventRegistrations);

export default router;
