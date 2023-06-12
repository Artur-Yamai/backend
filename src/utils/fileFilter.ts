import { Request } from "express";
import { FileFilterCallback as FFCB } from "multer";

export const fileFilter = (types: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: FFCB): void => {
    let isChecked = false;
    for (const type of types) {
      if (file.mimetype === type) {
        isChecked = true;
        break;
      }
    }
    cb(null, isChecked);
  };
};
