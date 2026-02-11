import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { checkEventAccess } from "./eventController.js";

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

    // 1. Check Deadline
    if (
      event.registrationDeadline &&
      new Date() > new Date(event.registrationDeadline)
    ) {
      return res
        .status(400)
        .json({ message: "Registration invalid: Deadline has passed" });
    }

    // 2. Check Capacity
    if (event.maxParticipants) {
      const currentCount = await prisma.registration.count({
        where: { eventId },
      });
      if (currentCount >= event.maxParticipants) {
        return res
          .status(400)
          .json({ message: "Registration invalid: Event is full" });
      }
    }

    // 3. New Validations for Team and Custom Form
    const { teamName, teamMembers, formData } = req.body;

    if (event.isTeamEvent) {
      if (!teamName || !teamName.trim()) {
        return res
          .status(400)
          .json({ message: "Team name is required for team events" });
      }

      let members = [];
      if (Array.isArray(teamMembers)) {
        members = teamMembers;
      }

      // Check Team Size (including the registrant)
      // If team logic considers the registrant + members list.
      // Usually "teamMembers" includes everyone, or everyone except registrant.
      // Let's assume teamMembers is list of OTHER members, total = 1 + members.length
      // OR teamMembers includes everyone. Let's assume input includes EVERYONE for simplicity if frontend sends it,
      // but usually student registering is implicitly part of it.
      // Let's stick to: teamMembers array contains NAMES of other members.
      const currentTeamSize = 1 + (members.length || 0);

      if (currentTeamSize < event.minTeamSize) {
        return res
          .status(400)
          .json({ message: `Minimum team size is ${event.minTeamSize}` });
      }
      if (currentTeamSize > event.maxTeamSize) {
        return res
          .status(400)
          .json({ message: `Maximum team size is ${event.maxTeamSize}` });
      }
    }

    // Check Form Config
    if (
      event.formConfig &&
      Array.isArray(event.formConfig) &&
      event.formConfig.length > 0
    ) {
      if (!formData) {
        return res.status(400).json({ message: "Form data is missing" });
      }

      for (const field of event.formConfig) {
        if (
          field.required &&
          (!formData[field.label] || formData[field.label].trim() === "")
        ) {
          return res
            .status(400)
            .json({ message: `Missing required field: ${field.label}` });
        }
      }
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
        teamName,
        teamMembers: teamMembers ? teamMembers : undefined,
        formData: formData ? formData : undefined,
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
    // Check Authorization
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        coordinators: { select: { id: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "FACULTY" && !checkEventAccess(event, req.user)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these registrations" });
    }

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
            semester: true,
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

// @desc    Deregister / Cancel registration (individual or team)
// @route   DELETE /api/registrations/:id
// @access  Private (Student - own registration only)
const deleteRegistration = async (req, res) => {
  const { id: registrationId } = req.params;

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Only the student who registered can cancel
    if (registration.studentId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this registration" });
    }

    await prisma.registration.delete({
      where: { id: registrationId },
    });

    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error cancelling registration" });
  }
};

// @desc    Manually register a student (Manual Entry)
// @route   POST /api/registrations/manual
// @access  Private (Coordinator/Faculty)
const createManualRegistration = async (req, res) => {
  const { eventId, name, email, rollNumber, phone } = req.body;

  try {
    // 0. Check Authorization
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        coordinators: { select: { id: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "FACULTY" && !checkEventAccess(event, req.user)) {
      return res.status(403).json({
        message: "Not authorized to add registrations for this event",
      });
    }
    // 1. Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. If not, create new user
    if (!user) {
      const crypto = await import("crypto");
      const tempPassword = crypto.randomBytes(16).toString("hex");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      // TODO: Send email with tempPassword
      console.log(
        `[MANUAL_REGISTRATION] Created user ${email} with password: ${tempPassword}`,
      );

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
  deleteRegistration,
  createManualRegistration,
};
