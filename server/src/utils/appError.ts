export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number = 500) {
    //invoke constructor of the parent class with the "message" argument passed to the AppError
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}
