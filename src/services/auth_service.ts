import { NextFunction, Response } from "express";
import { PrismaClient } from "../../orm";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import {
  comparePassword,
  generatePasswordHash,
} from "../utils/password_helper";
import { ResponseHandler } from "../utils/response_handler";
import { schemas } from "../utils/schemas";
import * as jwt from "jsonwebtoken";

export class AuthService {
  private db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async registerUser(res: Response, next: NextFunction, data: any) {
    try {
      const { password } = data;
      const passwordHash = await generatePasswordHash(password);
      if (!password) {
        const err = new CustomError(
          "Unable to register the user",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      const user = await this.db.user.create({
        data: { ...data, password: passwordHash },
        select: schemas.userSchema,
      });
      if (!user) {
        const err = new CustomError(
          "Unable to register the user",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(user, res, HttpStatusCode.CREATED);
    } catch (error: any) {
      console.log("error while registering the user:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async loginUser(res: Response, next: NextFunction, data: any) {
    try {
      const { email, password } = data;
      const user = await this.db.user.findUnique({ where: { email } });
      if (!user) {
        const err = new CustomError(
          "Unable to authenticate the user",
          HttpStatusCode.NOT_FOUND,
          "NOT_FOUND"
        );
        return next(err);
      }
      const isPasswordMatched = await comparePassword(password, user.password);
      if (!isPasswordMatched) {
        const err = new CustomError(
          "Unable to authenticate the user",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      const token = await this.generateJwtToken({
        id: user.id,
        email: user.email,
      });
      if (!token) {
        const err = new CustomError(
          "Invalid credentials",
          HttpStatusCode.UNAUTHORIZED,
          "UNAUTHORIZED"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(
        { access_token: token },
        res,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      console.log("error while authenticating the user:");
      console.log(error);
      const err = new CustomError(
        "Unable to authenticate the user",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async generateJwtToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });
  }
}
