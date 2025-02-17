import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../utils/ApiError";
// import multerS3 from "multer-s3";
// import { s3 } from "../utils/uploadToAws";
import iconv from "iconv-lite";

const createDirIfNotExist = (dir: string) => {
  if (!fs.existsSync(dir)) {
    // If not, create it
    fs.mkdirSync(dir, { recursive: true });
  }
};

const imagesExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".svg+xml",
  ".svg",
  ".heic",
  ".heif",
];
const audioExtensions = [
  ".mpeg",
  ".wav",
  ".aiff",
  ".ogg",
  ".amr",
  ".mp3",
  ".webm",
  ".x-m4a",
  ".flac",
  ".aac",
  ".x-wav",
  ".x-aiff",
  ".m4a",
  ".caf",
  ".opus",
];

const documentsExtensions = [
  ".txt",
  ".csv",
  ".log",
  ".md",
  ".doc",
  ".docx",
  ".pdf",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

const videoExtensions = [
  ".mp4",
  ".avi",
  ".mov",
  ".wmv",
  ".flv",
  ".mkv",
  ".webm",
  ".mpeg",
  ".mpg",
  ".m4v",
];

// Define the storage configuration
const localStorage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: Function) {
    const extension = path.extname(file.originalname);
    const isImage = imagesExtensions.includes(extension);
    const isAudio = audioExtensions.includes(extension);
    const isDocument = documentsExtensions.includes(extension);
    const isVideo = videoExtensions.includes(extension);

    let uploadDirectory = "";
    if (isImage) {
      uploadDirectory = path.join(__dirname, "../public/images");
    } else if (isAudio) {
      uploadDirectory = path.join(__dirname, "../public/audio");
    } else if (isDocument) {
      uploadDirectory = path.join(__dirname, "../public/documents");
    } else if (isVideo) {
      uploadDirectory = path.join(__dirname, "../public/videos");
    } else {
      return cb(new Error("Unsupported file type"), null);
    }
    createDirIfNotExist(uploadDirectory);

    cb(null, uploadDirectory);
  },

  filename: function (req: Request, file: any, cb: Function) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const originalNameWithoutExt = path.parse(file.originalname).name;
    console.log("file.originalnameeee", file);
    const filename = decodeURIComponent(
      uniqueSuffix +
        // originalNameWithoutExt +
        path.extname(file.originalname)
    );

    // Determine the relative path for the file
    const extension = path.extname(file.originalname).toLowerCase();
    const isImage = imagesExtensions.includes(extension);
    const isAudio = audioExtensions.includes(extension);
    const isDocument = documentsExtensions.includes(extension);
    const isVideo = videoExtensions.includes(extension);

    let relativePath: string = "";
    if (isImage) relativePath = `/public/images/${filename}`;
    if (isAudio) relativePath = `/public/audio/${filename}`;
    if (isDocument) relativePath = `/public/documents/${filename}`;
    if (isVideo) relativePath = `/public/videos/${filename}`;

    // Add the path to req.body using the field name
    req.body[file.fieldname] = relativePath;
    cb(null, filename);
  },
});

// Updated file filter with additional file extensions
const fileFilter = (req: Request, file: any, cb: Function) => {
  const allowedTypes = [
    ...imagesExtensions,
    ...audioExtensions,
    ...documentsExtensions,
    ...videoExtensions,
  ];
  const extension = path.extname(file.originalname);

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        "Invalid file type. Only images , audio, documents and videos files are allowed",
        400
      ),
      false
    );
  }
};

export const upload = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50 MB limit
});
