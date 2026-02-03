import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import env from "../config/env.js";

// Cloudinary Config
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const router = express.Router();

// Multer Config (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Public (or Protected if needed)
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "gdecfest_posters",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: "Image upload failed" });
      }
      res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    },
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

export default router;
