import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { fileFilter } from "../utils";

const createStorage = (path: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: path,
    filename: (_, file, cb) => {
      const params: string[] = file.originalname.split(".");
      const newPhotoName: string = uuidv4() + "." + params[params.length - 1];
      cb(null, newPhotoName);
    },
  });

export const createFileUploader = (path: string): multer.Multer =>
  multer({
    storage: createStorage(path),
    fileFilter: fileFilter(["image/png", "image/jpeg", "image/jpg"]),
  });
