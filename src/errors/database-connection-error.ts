import { CustomError, IError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  status: number = 500;

  constructor(message?: string) {
    super(message ?? "Database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  renderError(): IError[] {
    return [
      {
        message: this.message,
        status: this.status,
        field: this.name,
      },
    ];
  }
}
