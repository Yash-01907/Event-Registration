import express from 'express';
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addCoordinator,
  getCoordinatedEvents,
  togglePublishStatus,
} from '../controllers/eventController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createEvent).get(optionalAuth, getEvents);

router.get('/my-events', protect, getMyEvents);
router.get('/coordinated-events', protect, getCoordinatedEvents);

router
  .route('/:id')
  .get(optionalAuth, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);
router.post('/:id/coordinator', protect, addCoordinator);
router.patch('/:id/publish', protect, togglePublishStatus);

export default router;
