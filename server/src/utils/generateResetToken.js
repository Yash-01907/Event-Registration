import jwt from 'jsonwebtoken';

const RESET_EXPIRY = '1h';

export const generateResetToken = (userId) => {
  return jwt.sign(
    { userId, purpose: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: RESET_EXPIRY }
  );
};

export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password-reset') return null;
    return decoded.userId;
  } catch {
    return null;
  }
};
