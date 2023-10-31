import express, { Response } from "express";
import cors from "cors";
import ip from "ip";
import chalk from "chalk";
import {
  avatarsDirName,
  tobaccoDirName,
  coalDirName,
  rootDirNameObj,
  PORT,
} from "./constants";
import {
  technicalRouter,
  UserRouter,
  TobaccoRoutes,
  CommentRoutes,
  favoriteRoutes,
  ratingRoutes,
  referenceRoutes,
  coalRouter,
  adminUserRouter,
  adminLogsRouter,
} from "./routes";
import "./utils/PGChangeTypes";

const app: express.Express = express();

app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use("/uploads/coals", express.static(coalDirName));
app.use("/static/*", express.static("/dist/client"));
app.use(cors());

app.use(technicalRouter);
app.use(UserRouter);
app.use(TobaccoRoutes);
app.use(CommentRoutes);
app.use(favoriteRoutes);
app.use(ratingRoutes);
app.use(referenceRoutes);
app.use(coalRouter);

app.use(adminUserRouter);
app.use(adminLogsRouter);

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
