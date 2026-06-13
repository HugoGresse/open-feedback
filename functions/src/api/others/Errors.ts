import { CustomError } from 'ts-custom-error'

export class HttpError extends CustomError {
    public constructor(
        public statusCode: number,
        message: string
    ) {
        super(message)
    }
}

export class NotFoundError extends HttpError {
    constructor(message?: string) {
        super(404, message || 'Not Found')
    }
}

export class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(400, message || 'Bad Request')
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(401, message || 'Unauthorized')
    }
}

export class FormatError extends CustomError {
    public constructor(
        public statusCode: number,
        public code: string,
        public reason: string
    ) {
        super(reason)
    }
}
