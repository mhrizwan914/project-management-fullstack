export class api_error extends Error {
  constructor(status_code, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.status_code = status_code;
    this.errors = errors;
    this.success = status_code < 400;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
