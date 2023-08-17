import express, { Request, Response } from "express";
import cors from "cors";
import ip from "ip";
import chalk from "chalk";
import { avatarsDirName, tobaccoDirName, coalDirName } from "./constants";
import {
  UserRouter,
  TobaccoRoutes,
  CommentRoutes,
  favoriteRoutes,
  ratingRoutes,
  referenceRoutes,
  coalRouter,
} from "./routes";
import "./utils/PGChangeTypes";

const rootDirNameObj = { root: __dirname };
const port: number = 6060;
const app: express.Express = express();

app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use("/uploads/coals", express.static(coalDirName));
app.get("/static/*", express.static("/dist/client"));
app.use(cors());

app.use(UserRouter);
app.use(TobaccoRoutes);
app.use(CommentRoutes);
app.use(favoriteRoutes);
app.use(ratingRoutes);
app.use(referenceRoutes);
app.use(coalRouter);

app.get("/static/:dirName/:fileName", (req: Request, res: Response) => {
  const { dirName, fileName } = req.params;
  res.sendFile(`client/static/${dirName}/${fileName}`, rootDirNameObj);
});

app.get("/manifest.json", (_, res: Response) =>
  res.sendFile(`client/manifest.json`, rootDirNameObj)
);

app.get("*", (_, res: Response) =>
  res.sendFile("/client/index.html", rootDirNameObj)
);

app.listen(port, () => {
  const IP = ip.address();
  console.clear();

  console.log(`
  App running at:
  - Local:    ${chalk.cyan(`http://${IP}:${port}`)}
  - Network:  ${chalk.cyan(`http://localhost:${port}`)}
  `);
});
