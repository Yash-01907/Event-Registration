import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

import { body } from 'express-validator';
import { authLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 digits'),
  body('role').isIn(['STUDENT', 'FACULTY']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').exists().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('phone')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 digits'),
];

const changePasswordValidation = [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

router.post(
  '/register',
  authLimiter,
  validate(registerValidation),
  registerUser
);
router.post('/login', authLimiter, validate(loginValidation), loginUser);
router.post('/logout', logoutUser);
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordValidation),
  forgotPassword
);
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordValidation),
  resetPassword
);
router.get('/profile', protect, getUserProfile);
router.put(
  '/profile',
  protect,
  validate(updateProfileValidation),
  updateUserProfile
);
router.put(
  '/change-password',
  protect,
  validate(changePasswordValidation),
  changeUserPassword
);

export default router;
