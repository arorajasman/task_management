import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../orm";
import CustomError from "../utils/error_handler";
import HttpStatusCode from "../utils/http_status_code";
import { ResponseHandler } from "../utils/response_handler";

export class TaskService {
  private db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async getAllTasksForUser(res: Response, next: NextFunction, user: any) {
    try {
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to find the tasks for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const tasks = await this.db.task.findMany({ where: { userId: user.id } });
      if (!tasks) {
        const err = new CustomError(
          "Unable to find the tasks for the user",
          HttpStatusCode.NOT_FOUND,
          "NOT_FOUND"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(tasks, res, HttpStatusCode.OK);
    } catch (error: any) {
      console.log("error while getting the tasks:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async getTaskById(
    res: Response,
    next: NextFunction,
    user: any,
    taskId: string
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
      const task = await this.db.task.findUnique({
        where: { id: taskId, userId: user.id },
      });
      if (!task) {
        const err = new CustomError(
          `task with id ${taskId} not found`,
          HttpStatusCode.NOT_FOUND,
          "NOT_FOUND"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(task, res, HttpStatusCode.OK);
    } catch (error: any) {
      console.log("error while getting the task:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async addTask(res: Response, next: NextFunction, data: any, user: any) {
    try {
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to add task for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const task = await this.db.task.create({
        data: {
          ...data,
          userId: user.id,
        },
      });
      if (!task) {
        const err = new CustomError(
          "Unable to add task for the user",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(task, res, HttpStatusCode.CREATED);
    } catch (error: any) {
      console.log("error while adding the task:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction, user: any) {
    try {
      const { id } = req.params;
      const data = req.body;
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to update task for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const task = await this.db.task.findUnique({
        where: { id, userId: user.id },
      });
      if (!task) {
        const err = new CustomError(
          "Unable to update task for the user",
          HttpStatusCode.NOT_FOUND,
          "NOT_FOUND"
        );
        return next(err);
      }
      const updatedTask = await this.db.task.update({
        where: { id, userId: user.id },
        data: { ...data },
      });
      if (!updatedTask) {
        const err = new CustomError(
          "Unable to update task for the user",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(
        updatedTask,
        res,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      console.log("error while updating the task:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async updateTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
    user: any
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to update task for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const task = await this.db.task.findUnique({
        where: { id, userId: user.id },
      });
      if (!task) {
        const err = new CustomError(
          `Task with id ${id} not found`,
          HttpStatusCode.NOT_FOUND,
          "TASK NOT FOUND"
        );
        return next(err);
      }
      const updatedTask = await this.db.task.update({
        where: { id, userId: user.id },
        data: { status },
      });
      if (!updatedTask) {
        const err = new CustomError(
          "Unable to update the task status",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(
        updatedTask,
        res,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      console.log("Error while updating the task status:");
      console.log(error);
      const err = new CustomError(
        error,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR"
      );
      next(err);
    }
  }

  async deleteTaskById(
    res: Response,
    next: NextFunction,
    id: string,
    user: any
  ) {
    try {
      if (!user || !user.id) {
        const err = new CustomError(
          "Unable to update task for the user",
          HttpStatusCode.NOT_FOUND,
          "Unable to get the id of the user"
        );
        return next(err);
      }
      const task = await this.db.task.findUnique({
        where: { id, userId: user.id },
      });
      if (!task) {
        const err = new CustomError(
          `Task with id ${id} not found`,
          HttpStatusCode.NOT_FOUND,
          "TASK NOT FOUND"
        );
        return next(err);
      }
      const deletedTask = await this.db.task.delete({
        where: { id, userId: user.id },
      });
      if (!deletedTask) {
        const err = new CustomError(
          "Unable to delete the task",
          HttpStatusCode.BAD_REQUEST,
          "BAD_REQUEST"
        );
        return next(err);
      }
      return ResponseHandler.successResponse(
        "",
        res,
        HttpStatusCode.NO_CONTENT
      );
    } catch (error: any) {
      console.log("Error while deleting the task:");
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
