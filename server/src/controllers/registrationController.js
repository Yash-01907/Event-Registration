import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private (Student)
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const studentId = req.user.id;

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        studentId,
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        studentId,
        type: "ONLINE",
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        studentId: req.user.id,
      },
      include: {
        event: {
          include: {
            mainCoordinator: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Faculty/Coordinator)
const getEventRegistrations = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Optional: Check if user is authorized (coordinator of this event or faculty)
    // For now, relying on protected route generic check, but ideally:
    // if (req.user.role !== 'FACULTY' && !req.user.coordinatedEvents.some(e => e.id === eventId)) ...

    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            branch: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Manually register a student (Manual Entry)
// @route   POST /api/registrations/manual
// @access  Private (Coordinator/Faculty)
const createManualRegistration = async (req, res) => {
  const { eventId, name, email, rollNumber, phone } = req.body;

  try {
    // 1. Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. If not, create new user
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("event123", salt);

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
          rollNumber,
          phone,
        },
      });
    }

    // 3. Check if already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        studentId: user.id,
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "Student is already registered for this event" });
    }

    // 4. Create Registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        studentId: user.id,
        type: "MANUAL",
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  createManualRegistration,
};
