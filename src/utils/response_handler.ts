import { Response } from "express";
import HttpStatusCode from "./http_status_code";

export const ResponseHandler = {
    successResponse: (data: any, res: Response, statusCode: HttpStatusCode) => {
      res.status(statusCode).json({
        message: "Success",
        data,
      });
    },
  };
  