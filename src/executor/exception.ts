export class SlangTypeError extends Error {
  constructor(msg, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlangTypeError)
    }

    this.name = 'SlangTypeError'
  }
}

export class SlangArityError extends Error {
  constructor(msg, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlangArityError)
    }

    this.name = 'SlangArityError'
  }
}
