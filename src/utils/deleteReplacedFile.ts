import fs from "fs";
import logger from "../logger/logger.service";

export const deleteReplacedFile = (path: string): void => {
  fs.unlink(path, (err) => {
    if (err) logger.error(err.message);
  });
};
