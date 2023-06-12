import pg from "pg";

// данные не настоящие
export default new pg.Pool({
  user: "user",
  password: "password",
  host: "localhost",
  port: 0,
  database: "database",
});
