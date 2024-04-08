import pg from "pg";
import { config } from "dotenv";
config();

const validatePort = (port: string | undefined): number => {
  if (port === undefined) {
    throw new Error("Port is undefined");
  }
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort) || parsedPort < 1024 || parsedPort > 65535) {
    throw new Error("Port is not a number");
  }
  return parsedPort;
};

const db: pg.Pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: validatePort(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default db;
