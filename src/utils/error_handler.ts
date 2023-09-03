class CustomError extends Error {
  public statusCode: number;
  public type: string;

  constructor(message: string, statusCode: number, type: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default CustomError;
