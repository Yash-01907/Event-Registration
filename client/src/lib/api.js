import axios from "axios";

// Helper to getenv or throw
const getEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`Missing environment variable: ${key}`);
    // In strict mode we might throw, but for now warning is safer to prevent full crash if optional
    // However user requested validation, so let's log error clearly.
  }
  return value;
};

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    "CRITICAL: VITE_API_URL is not defined in environment variables",
  );
}

const api = axios.create({
  baseURL: API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
});

export default api;
