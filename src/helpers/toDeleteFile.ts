import fs from "fs";
import logger from "../logger/logger.service";

export const toDeleteFile = (path: string): void => {
  fs.unlink(path, (err: NodeJS.ErrnoException | null): void => {
    if (err) logger.error(err.message);
  });
};
