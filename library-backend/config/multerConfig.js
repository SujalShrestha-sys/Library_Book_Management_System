import multer from "multer";
import path from "path";
import fs from "fs";

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique name
  },
});
const filterFile = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only JPEG, JPG, PNG, images are allowed."
      )
    );
  }
};

const limits = {
  fileSize: 1024 * 1024 * 10, // 5MB
};

const upload = multer({
  storage,
  fileFilter: filterFile,
  limits,
});

export default upload;
