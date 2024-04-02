interface UserPayload {
  id: string;
  email: string;
}

declare namespace Express {
  interface Request {
    user?: UserPayload;
  }
}
