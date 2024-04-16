import { router as UserRouter } from "./userRoutes";
import { router as TobaccoRoutes } from "./tobaccoRoutes";
import { router as CommentRoutes } from "./commentRoutes";
import { router as favoriteRoutes } from "./favoriteRoutes";
import { router as ratingRoutes } from "./ratingRoutes";
import { router as referenceRoutes } from "./referenceRoutes";
import { router as coalRouter } from "./coalRouter";
import { router as technicalRouter } from "./technicalRouter";

import { adminUserRouter, adminLogsRouter } from "./admin";

export default [
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
];
