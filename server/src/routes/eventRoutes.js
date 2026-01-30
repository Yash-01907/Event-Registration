import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  addCoordinator,
  getCoordinatedEvents,
  togglePublishStatus,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createEvent).get(getEvents);

router.get("/my-events", protect, getMyEvents);
router.get("/coordinated-events", protect, getCoordinatedEvents);

router.route("/:id").get(getEventById).put(protect, updateEvent);
router.post("/:id/coordinator", protect, addCoordinator);
router.patch("/:id/publish", protect, togglePublishStatus);

export default router;
