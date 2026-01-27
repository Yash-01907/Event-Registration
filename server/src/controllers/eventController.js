import prisma from "../config/db.js";

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
        date: date ? new Date(date) : null,
        description,
        location,
        fees: fees ? parseInt(fees) : 0,
        category,
        posterUrl,
        mainCoordinatorId: req.user.id,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating event" });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        mainCoordinator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching events" });
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
        date: "desc",
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching your events" });
  }
};

export { createEvent, getEvents, getMyEvents };
