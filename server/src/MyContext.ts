import { Request, Response } from "express";
import { DataSource } from "typeorm";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
  AppDataSource: DataSource;
}
