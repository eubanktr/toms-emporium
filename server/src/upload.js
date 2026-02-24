import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  // only allow images
  if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image uploads are allowed"));
}

// store files in memory so we can stream to Cloudinary
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 6,
    fileSize: 8 * 1024 * 1024 }, // up to 6 files, 8MB each
});