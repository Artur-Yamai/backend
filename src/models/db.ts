import pg from "pg";
import { dbData } from "../secrets";

const db: pg.Pool = new pg.Pool({
  user: dbData.user,
  password: dbData.password,
  host: dbData.host,
  port: dbData.port,
  database: dbData.database,
});

export default db;
