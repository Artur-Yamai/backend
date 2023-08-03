import express from "express";
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
app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use("/uploads/coals", express.static(coalDirName));
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>In process</h1>");
});

app.use(UserRouter);
app.use(TobaccoRoutes);
app.use(CommentRoutes);
app.use(favoriteRoutes);
app.use(ratingRoutes);
app.use(referenceRoutes);
app.use(coalRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
