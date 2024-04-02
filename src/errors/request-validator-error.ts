import { ValidationError } from "express-validator";
import { CustomError, IError } from "./custom-error";

export class RequestValidatorError extends CustomError {
  status: number = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request paramters");
    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }
  renderError(): IError[] {
    return this.errors.map((error) => ({
      message: error.msg,
      status: this.status,
      field: error.type,
    }));
  }
}
