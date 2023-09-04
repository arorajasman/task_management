import { NextFunction, Response } from "express";
import Joi from "joi";
import { PrismaClient } from "../../orm";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import { ResponseHandler } from "../utils/response_handler";
import { schemas } from "../utils/schemas";

export class NotificationService {
  private db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async getAllNotifications(res: Response, next: NextFunction, user: any) {
    try {
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to find the tasks for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const notifications = await this.db.notification.findMany({
        where: {
          userId: user.id,
        },
      });
      return ResponseHandler.successResponse(
        notifications,
        res,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      console.log("Error while getting the list of notifications: ");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async getNotificationById(
    res: Response,
    next: NextFunction,
    user: any,
    id: string
  ) {
    try {
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to find the tasks for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const notification = await this.db.notification.findUnique({
        where: { id, userId: user.id },
      });
      if (!notification) {
        const err = new CustomError(
          `Notification with id ${id} not found`,
          HttpStatusCode.NOT_FOUND,
          "NOT_FOUND"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(
        notification,
        res,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      console.log("Error while getting the details of notification: ");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  // method below is used to create a new notification
  async createNotification(
    res: Response,
    next: NextFunction,
    userId: string,
    notificationData: any
  ) {
    try {
      if (!userId) {
        const err = new CustomError(
          "Unable to find the tasks for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const data: Joi.ValidationResult<any> =
        schemas.createNotificationSchema.validate(notificationData);
      if (data.error) {
        const err = new CustomError(
          data.error.message.toString(),
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      const notification = await this.db.notification.create({
        data: { ...notificationData, userId },
      });
      if (!notification) {
        const err = new CustomError(
          "Unable to create the notification",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      // the line below is for debugging purpose
      console.log("notification", notification);
      return notification;
    } catch (error: any) {
      console.log("Error while creating the notification: ");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }
}
