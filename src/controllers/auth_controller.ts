import express, { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { PrismaClient } from "../../orm";
import { AuthService } from "../services";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import { schemas } from "../utils/schemas";

export class AuthController {
  private router: Router = express.Router();
  private authService: AuthService;

  public getRouter() {
    return this.router;
  }

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);

    this.router.post(
      "/register",
      (req: Request, res: Response, next: NextFunction) => {
        return this.registerUser(req, res, next);
      }
    );

    this.router.post(
      "/login",
      (req: Request, res: Response, next: NextFunction) => {
        return this.loginUser(req, res, next);
      }
    );
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      // validate the user using the joi schema
      const data: Joi.ValidationResult<any> =
        schemas.registerUserSchema.validate(req.body);
      if (data.error) {
        const err = new CustomError(
          data.error.message.toString(),
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return await this.authService.registerUser(res, next, req.body);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      // validate the user using the joi schema
      const data: Joi.ValidationResult<any> = schemas.loginUserSchema.validate(
        req.body
      );
      if (data.error) {
        const err = new CustomError(
          "Unable to authenticate the user",
          HttpStatusCode.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
        return next(err);
      }
      return await this.authService.loginUser(res, next, req.body);
    } catch (error: any) {
      const err = new CustomError(
        "Unable to authenticate the user",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }
}
