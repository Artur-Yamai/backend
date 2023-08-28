import { Router, Request, Response } from "express";
import { rootDirNameObj } from "../constants";

const router = Router();

router.get("/static/:dirName/:fileName", (req: Request, res: Response) => {
  const { dirName, fileName } = req.params;
  res.sendFile(`client/static/${dirName}/${fileName}`, rootDirNameObj);
});

router.get("/assets/:dirName/:fileName", (req: Request, res: Response) => {
  const { dirName, fileName } = req.params;
  res.sendFile(`adminpanel/assets/${dirName}/${fileName}`, rootDirNameObj);
});

router.get("/favicon.ico", (_, res: Response) =>
  res.sendFile(`client/favicon.ico`, rootDirNameObj)
);

router.get("/logo192.png", (_, res: Response) =>
  res.sendFile(`client/logo192.png`, rootDirNameObj)
);

router.get("/manifest.json", (_, res: Response) =>
  res.sendFile(`client/manifest.json`, rootDirNameObj)
);

export { router };
