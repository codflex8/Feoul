import { NextFunction, Request, Response } from "express";

export class IndexController {
  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    // Logic to get a user
    return res.json({ message: "Get user" });
  }

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    // Logic to create a user
    return res.json({ message: "User created" });
  }
}
