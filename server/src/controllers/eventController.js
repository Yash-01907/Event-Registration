import prisma from '../config/db.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Faculty only ideally, but generally Protected for now)
const createEvent = async (req, res) => {
  const { name, date, description, location, fees, category, posterUrl } =
    req.body;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        date: date ? new Date(date) : undefined,
        description,
        location,
        fees: fees ? parseInt(fees) : 0,
        category,
        posterUrl,
        mainCoordinatorId: req.user.id,
        isTeamEvent: req.body.isTeamEvent || false,
        minTeamSize: req.body.minTeamSize ? parseInt(req.body.minTeamSize) : 1,
        maxTeamSize: req.body.maxTeamSize ? parseInt(req.body.maxTeamSize) : 1,
        formConfig: req.body.formConfig || null,
        semControlEnabled: req.body.semControlEnabled || false,
        maxSem:
          req.body.semControlEnabled && req.body.maxSem != null
            ? parseInt(req.body.maxSem)
            : null,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const where = { isPublished: true };
    if (req.user?.role === 'STUDENT' && req.user?.semester != null) {
      where.AND = [
        {
          OR: [
            { semControlEnabled: false },
            {
              semControlEnabled: true,
              maxSem: { gte: req.user.semester },
            },
          ],
        },
      ];
    }
    const events = await prisma.event.findMany({
      where,
      include: {
        mainCoordinator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// @desc    Get events created by logged in user
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        mainCoordinatorId: req.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your events' });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        mainCoordinator: {
          select: { name: true, email: true },
        },
        coordinators: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Sem-control: hide from students with semester > maxSem
    if (
      event.semControlEnabled &&
      event.maxSem != null &&
      req.user?.role === 'STUDENT' &&
      req.user?.semester != null &&
      req.user.semester > event.maxSem
    ) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
};

// Helper to check event access
const checkEventAccess = (event, user) => {
  if (user.role === 'ADMIN') return true;
  const isCoordinator = event.coordinators.some((c) => c.id === user.id);
  const isMain = event.mainCoordinatorId === user.id;
  return isMain || isCoordinator;
};

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private (Main Coordinator only or Admin)
const updateEvent = async (req, res) => {
  const { name, date, description, location, fees, category, posterUrl } =
    req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        coordinators: {
          select: { id: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!checkEventAccess(event, req.user)) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        description,
        location,
        fees: fees ? parseInt(fees) : 0,
        category,
        posterUrl,
        isTeamEvent: req.body.isTeamEvent,
        minTeamSize: req.body.minTeamSize
          ? parseInt(req.body.minTeamSize)
          : undefined,
        maxTeamSize: req.body.maxTeamSize
          ? parseInt(req.body.maxTeamSize)
          : undefined,
        formConfig: req.body.formConfig,
        semControlEnabled: req.body.semControlEnabled,
        maxSem:
          req.body.semControlEnabled && req.body.maxSem != null
            ? parseInt(req.body.maxSem)
            : null,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

// @desc    Add student coordinator to event
// @route   POST /api/events/:id/coordinator
// @access  Private (Main Coordinator only or Admin)
const addCoordinator = async (req, res) => {
  const { email } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.mainCoordinatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Not authorized to add coordinators' });
    }

    const student = await prisma.user.findUnique({
      where: { email },
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: 'Student not found with this email' });
    }

    await prisma.event.update({
      where: { id: req.params.id },
      data: {
        coordinators: {
          connect: { id: student.id },
        },
      },
    });

    res.status(200).json({ message: 'Coordinator added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding coordinator' });
  }
};

// @desc    Get events where user is a coordinator
// @route   GET /api/events/coordinated-events
// @access  Private
const getCoordinatedEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        coordinators: {
          some: {
            id: req.user.id,
          },
        },
      },
      include: {
        mainCoordinator: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Server error fetching coordinated events' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Main Coordinator, Coordinators, or Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        coordinators: {
          select: { id: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!checkEventAccess(event, req.user)) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this event' });
    }

    // Delete registrations first (foreign key constraint)
    await prisma.registration.deleteMany({
      where: { eventId: req.params.id },
    });

    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

// @desc    Toggle event publish status
// @route   PATCH /api/events/:id/publish
// @access  Private (Main Coordinator only or Admin)
const togglePublishStatus = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        coordinators: {
          select: { id: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!checkEventAccess(event, req.user)) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        isPublished: !event.isPublished,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating publish status' });
  }
};

export {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addCoordinator,
  getCoordinatedEvents,
  togglePublishStatus,
  checkEventAccess,
};
