import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, rollNumber, branch, phone } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        rollNumber,
        branch,
        phone,
      },
    });

    if (user) {
      generateToken(res, user.id);

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        branch: user.branch,
        phone: user.phone,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        coordinatedEvents: {
          select: { id: true },
        },
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id);

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        branch: user.branch,
        phone: user.phone,
        coordinatedEvents: user.coordinatedEvents,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    rollNumber: req.user.rollNumber,
    branch: req.user.branch,
    phone: req.user.phone,
    coordinatedEvents: req.user.coordinatedEvents,
  };
  res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.rollNumber = req.body.rollNumber || user.rollNumber;
    user.branch = req.body.branch || user.branch;

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        rollNumber: user.rollNumber,
        branch: user.branch,
      },
      include: {
        coordinatedEvents: {
          select: { id: true },
        },
      },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      rollNumber: updatedUser.rollNumber,
      branch: updatedUser.branch,
      phone: updatedUser.phone,
      coordinatedEvents: updatedUser.coordinatedEvents,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user && (await bcrypt.compare(currentPassword, user.password))) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Password updated successfully" });
  } else {
    res.status(401).json({ message: "Invalid current password" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
};
