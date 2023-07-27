import { Request, Response } from "express";

export const create = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "create" });
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "getAll" });
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "getById" });
};

export const update = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "update" });
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "remove" });
};

export const getCoalComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json({ success: true, message: "getCoalComments" });
};
