import { Request } from "express";
import multer from "multer";
import uuid from "../utils/uuid";

const multerStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, `${__dirname}/../../public/quizzes/single`);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `quiz-${uuid()}-${Date.now()}.${ext}`;
    req.body.image = filename;
    req.body.images = [];
    cb(null, filename);
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

export const uploadQuizImageDisk = upload.single("image");
