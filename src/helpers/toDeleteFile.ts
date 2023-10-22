import fs from "fs";
import logger from "../logger/logger.service";

export const toDeleteFile = (path: string): void => {
  fs.unlink(path, (err: NodeJS.ErrnoException | null): void => {
    if (!err) return;

    process.env.NODE_ENV === "production"
      ? logger.logToFile("error", { message: err.message })
      : logger.error(err.message);
  });
};
