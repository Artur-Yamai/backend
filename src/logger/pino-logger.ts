import pino from "pino";

export default pino({}, pino.destination("./pino-logger.log"));
