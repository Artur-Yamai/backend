import multer from "multer";
import { fileFilter } from "../utils";

const createStorage = (path: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: path,
    filename: (_, file, cb) => {
      const params: string[] = file.originalname.split(".");
      const newFileName: string = Date.now() + "" + Math.random();
      const newPhotoName: string =
        newFileName + "." + params[params.length - 1];
      cb(null, newPhotoName);
    },
  });

export const createFileUploader = (path: string): multer.Multer =>
  multer({
    storage: createStorage(path),
    fileFilter: fileFilter(["image/png", "image/jpeg", "image/jpg"]),
  });
