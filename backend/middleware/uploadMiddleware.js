import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure path is absolute and created
const uploadPath = path.resolve("uploads/documents");

console.log("UPLOAD PATH:", uploadPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `reporter-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|jpg|jpeg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.test(ext) ? cb(null, true) : cb(new Error("Unsupported file type"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;

