import dotenv from "dotenv";
dotenv.config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CORS_ORIGIN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

export default {
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
