import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

import env from "./config/env.js";

const app = express();
const PORT = env.server.port;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
// Rate Limit Global (loose)
import { apiLimiter } from "./middleware/rateLimit.js";
app.use("/api", apiLimiter);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
import uploadRoutes from "./routes/uploadRoutes.js";
app.use("/api/upload", uploadRoutes);

// Error Handling
import { errorHandler } from "./middleware/errorMiddleware.js";
app.use(errorHandler);

// Basic Route
app.get("/", (req, res) => {
  res.send("UniFest API is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
