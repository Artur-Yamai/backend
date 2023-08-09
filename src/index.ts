import express, { Request, Response } from "express";
import cors from "cors";
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

const port: number = 6060;
const app: express.Express = express();
const root = { root: __dirname + "/../dist" };

app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use("/uploads/coals", express.static(coalDirName));
// app.get("/static/*", express.static("/dist/client"));
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
  res.sendFile(`client/static/${dirName}/${fileName}`, root);
});

app.get("/manifest.json", (_, res: Response) =>
  res.sendFile(`client/manifest.json`, root)
);

app.get("*", (_, res: Response) => res.sendFile("/client/index.html", root));

app.listen(port, () => console.log(`http://localhost:${port}`));
