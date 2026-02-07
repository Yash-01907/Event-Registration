import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          rollNumber: true,
          branch: true,
          semester: true,
          phone: true,
          coordinatedEvents: {
            select: { id: true },
          },
        },
      });

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Optional auth: populate req.user if token exists, but don't fail if no token
const optionalAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        rollNumber: true,
        branch: true,
        semester: true,
        phone: true,
        coordinatedEvents: { select: { id: true } },
      },
    });
  } catch {
    // Invalid token - ignore, req.user stays undefined
  }
  next();
};

export { protect, optionalAuth };
