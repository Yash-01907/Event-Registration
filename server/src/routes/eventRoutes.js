import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createEvent).get(getEvents);

router.get("/my-events", protect, getMyEvents);

export default router;
