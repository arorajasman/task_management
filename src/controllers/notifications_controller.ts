import express, { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../orm";
import { NotificationService } from "../services";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import { validateUserMiddleware } from "../utils/middlewares";

export class NotificationController {
  private router: Router = express.Router();
  private notificationService: NotificationService;

  public getRouter() {
    return this.router;
  }

  constructor(prisma: PrismaClient) {
    this.notificationService = new NotificationService(prisma);

    this.router.get(
      "/",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.getAllNotifications(req, res, next);
      }
    );
    this.router.get(
      "/:id",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.getNotificationById(req, res, next);
      }
    );
  }

  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.notificationService.getAllNotifications(
        res,
        next,
        req.user
      );
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      return await this.notificationService.getNotificationById(
        res,
        next,
        req.user,
        id
      );
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }
}
