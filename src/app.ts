import bodyParser from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { PrismaClient } from "../orm";
import {
  AuthController,
  NotificationController,
  TaskController,
} from "./controllers";
import Database from "./database/database";
import { errorMiddlware } from "./utils/middlewares";
import * as dotenv from "dotenv";

class ExpressApp {
  public app: Application;
  private prisma: PrismaClient;
  private static BASE_URL: string;

  constructor() {
    dotenv.config({ path: __dirname + "/.env" });
    ExpressApp.BASE_URL = "/api/v1/";
    this.app = express();
    this.prisma = Database.getInstance().getDB();
    this.config();
  }

  private config(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    // initialize routes

    this.app.use(
      `${ExpressApp.BASE_URL}auth`,
      new AuthController(this.prisma).getRouter()
    );
    this.app.use(
      `${ExpressApp.BASE_URL}tasks`,
      new TaskController(this.prisma).getRouter()
    );
    this.app.use(
      `${ExpressApp.BASE_URL}notifications`,
      new NotificationController(this.prisma).getRouter()
    );

    this.app.use(errorMiddlware);
  }
}

export default new ExpressApp().app;
