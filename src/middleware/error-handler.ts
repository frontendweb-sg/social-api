import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { MulterError } from "multer";
import { BadRequestError } from "../errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof MulterError) {
    error = new BadRequestError("You can not upload more than 5 files.");
  }
  if (error instanceof CustomError) {
    return res.status(error.status).send({ errors: error.renderError() });
  }

  res.send({
    error: "Something went wrong",
  });
};
