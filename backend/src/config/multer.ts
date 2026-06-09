import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDir = path.resolve(__dirname, "..", "..", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const hash = crypto.randomBytes(16).toString("hex");
            const fileName = `${hash}-${file.originalname}`;
            cb(null, fileName);
        }
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimeTypes = ["application/pdf"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Apenas arquivos PDF são permitidos."));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
};
