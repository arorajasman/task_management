import express, { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { PrismaClient } from "../../orm";
import { TaskService } from "../services";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import { validateUserMiddleware } from "../utils/middlewares";
import { schemas } from "../utils/schemas";

export class TaskController {
  private router: Router = express.Router();
  private taskService: TaskService;

  public getRouter() {
    return this.router;
  }

  constructor(prisma: PrismaClient) {
    this.taskService = new TaskService(prisma);
    //tasks CRUD for current user
    this.router.get(
      "/",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.getAllTasksForUser(req, res, next);
      }
    );
    this.router.get(
      "/:id",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.getTaskById(req, res, next);
      }
    );
    this.router.post(
      "/",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.addTask(req, res, next);
      }
    );
    this.router.put(
      "/:id",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.updateTask(req, res, next);
      }
    );
    // update status of task
    this.router.patch(
      "/:id/status",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.updateTaskStatus(req, res, next);
      }
    );
    this.router.delete(
      "/:id",
      validateUserMiddleware,
      (req: Request, res: Response, next: NextFunction) => {
        return this.deleteTaskById(req, res, next);
      }
    );
  }

  async getAllTasksForUser(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.taskService.getAllTasksForUser(res, next, req.user);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      return await this.taskService.getTaskById(res, next, req.user, id);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async addTask(req: Request, res: Response, next: NextFunction) {
    try {
      const data: Joi.ValidationResult<any> = schemas.addTaskSchema.validate(
        req.body
      );
      if (data.error) {
        const err = new CustomError(
          data.error.message.toString(),
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return await this.taskService.addTask(res, next, req.body, req.user);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const data: Joi.ValidationResult<any> = schemas.updateTaskSchema.validate(
        req.body
      );
      if (data.error) {
        const err = new CustomError(
          data.error.message.toString(),
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return await this.taskService.updateTask(req, res, next, req.user);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data: Joi.ValidationResult<any> =
        schemas.updateTaskStatusSchema.validate(req.body);
      if (data.error) {
        const err = new CustomError(
          data.error.message.toString(),
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return await this.taskService.updateTaskStatus(req, res, next, req.user);
    } catch (error: any) {
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async deleteTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      return await this.taskService.deleteTaskById(res, next, id, req.user);
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
