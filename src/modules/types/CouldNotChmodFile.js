export default class CouldNotChmodFile extends Error {
  constructor() {
    super();

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    this.status = 500;
  }
}
