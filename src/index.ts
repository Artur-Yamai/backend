import express from "express";
import cors from "cors";
import { avatarsDirName, tobaccoDirName } from "./constants";
import {
  UserRouter,
  TobaccoRoutes,
  CommentRoutes,
  favoriteTobaccoRoutes,
  ratingRoutes,
  referenceRoutes,
} from "./routes";
import "./utils/PGChangeTypes";

const port: number = 6060;
const app: express.Express = express();
app.use(express.json());
app.use("/uploads/avatars", express.static(avatarsDirName));
app.use("/uploads/tobaccos", express.static(tobaccoDirName));
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>In process</h1>");
});

app.use(UserRouter);
app.use(TobaccoRoutes);
app.use(CommentRoutes);
app.use(favoriteTobaccoRoutes);
app.use(ratingRoutes);
app.use(referenceRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
