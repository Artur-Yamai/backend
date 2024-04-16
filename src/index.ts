import express, { Response } from "express";
import cors from "cors";
import ip from "ip";
import chalk from "chalk";
import { config } from "dotenv";
import {
  avatarsDirName,
  tobaccoDirName,
  coalDirName,
  rootDirNameObj,
} from "./constants";
import routes from "./routes";
import "./utils/PGChangeTypes";

config();

const PORT = process.env.PORT;

const app: express.Express = express();

app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use("/uploads/coals", express.static(coalDirName));
app.use("/static/*", express.static("/dist/client"));
app.use(cors());

routes.forEach((route) => app.use(route));

app.get("/admin*", (_, res: Response) =>
  res.sendFile("/adminpanel/index.html", rootDirNameObj)
);

app.get("*", (_, res: Response) =>
  res.sendFile("/client/index.html", rootDirNameObj)
);

app.listen(PORT, () => {
  const IP = ip.address();
  console.clear();

  console.log(`
  Server started at:
  - Local:    ${chalk.cyan(`http://${IP}:${PORT}`)}
  - Network:  ${chalk.cyan(`http://localhost:${PORT}`)}
  `);
});
