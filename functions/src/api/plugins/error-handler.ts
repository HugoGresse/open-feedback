import {
    FastifyPluginAsync,
    FastifyError,
    FastifyRequest,
    FastifyReply,
} from 'fastify'
import fp from 'fastify-plugin'

export interface ApiError extends Error {
    statusCode?: number
    code?: string
    validation?: any[]
}

export class AppError extends Error implements ApiError {
    public readonly statusCode: number
    public readonly code: string
    public readonly isOperational: boolean

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        isOperational: boolean = true
    ) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends AppError {
    public readonly validation: any[]

    constructor(message: string, validation: any[] = []) {
        super(message, 400, 'VALIDATION_ERROR')
        this.validation = validation
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND')
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, 'FORBIDDEN')
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, 'CONFLICT')
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Rate limit exceeded') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED')
    }
}

const errorHandlerPlugin: FastifyPluginAsync = async (server) => {
    // Global error handler
    server.setErrorHandler(
        async (
            error: FastifyError,
            request: FastifyRequest,
            reply: FastifyReply
        ) => {
            const timestamp = new Date().toISOString()
            const path = request.url

            server.log.error(
                {
                    error: error.message,
                    stack: error.stack,
                    path,
                    method: request.method,
                    statusCode: error.statusCode,
                },
                'Request error'
            )

            // Handle validation errors
            if (error.validation) {
                return reply.code(400).send({
                    code: 'VALIDATION_ERROR',
                    error: 'Bad Request',
                    message: 'Validation failed',
                    statusCode: 400,
                    timestamp,
                    path,
                    details: error.validation,
                })
            }

            // Handle custom app errors
            if (error instanceof AppError) {
                const response: any = {
                    code: error.code,
                    error: getErrorName(error.statusCode),
                    message: error.message,
                    statusCode: error.statusCode,
                    timestamp,
                    path,
                }

                if (error instanceof ValidationError && error.validation) {
                    response.details = error.validation
                }

                return reply.code(error.statusCode).send(response)
            }

            // Handle Fastify errors
            if (error.statusCode) {
                const response = {
                    code: error.code || getErrorCode(error.statusCode),
                    error: getErrorName(error.statusCode),
                    message: error.message || 'An error occurred',
                    statusCode: error.statusCode,
                    timestamp,
                    path,
                }

                return reply.code(error.statusCode).send(response)
            }

            // Handle unexpected errors
            const statusCode = 500
            const response = {
                code: 'INTERNAL_ERROR',
                error: 'Internal Server Error',
                message:
                    process.env.NODE_ENV === 'production'
                        ? 'An unexpected error occurred'
                        : error.message,
                statusCode,
                timestamp,
                path,
            }

            // In development, include stack trace
            if (process.env.NODE_ENV !== 'production') {
                ;(response as any).stack = error.stack
            }

            return reply.code(statusCode).send(response)
        }
    )

    // Add error utility methods to server
    server.decorate(
        'createError',
        (message: string, statusCode: number = 500, code?: string) =>
            new AppError(message, statusCode, code)
    )

    server.decorate('notFound', (resource?: string) => {
        throw new NotFoundError(resource)
    })

    server.decorate('unauthorized', (message?: string) => {
        throw new UnauthorizedError(message)
    })

    server.decorate('forbidden', (message?: string) => {
        throw new ForbiddenError(message)
    })

    server.decorate('conflict', (message?: string) => {
        throw new ConflictError(message)
    })

    server.decorate(
        'validationError',
        (message: string, validation?: any[]) => {
            throw new ValidationError(message, validation)
        }
    )
}

function getErrorName(statusCode: number): string {
    const errorNames: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
    }

    return errorNames[statusCode] || 'Unknown Error'
}

function getErrorCode(statusCode: number): string {
    const errorCodes: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'UNPROCESSABLE_ENTITY',
        429: 'RATE_LIMIT_EXCEEDED',
        500: 'INTERNAL_ERROR',
        502: 'BAD_GATEWAY',
        503: 'SERVICE_UNAVAILABLE',
        504: 'GATEWAY_TIMEOUT',
    }

    return errorCodes[statusCode] || 'UNKNOWN_ERROR'
}

// Extend Fastify instance type
declare module 'fastify' {
    interface FastifyInstance {
        createError: (
            message: string,
            statusCode?: number,
            code?: string
        ) => AppError
        notFound: (resource?: string) => never
        unauthorized: (message?: string) => never
        forbidden: (message?: string) => never
        conflict: (message?: string) => never
        validationError: (message: string, validation?: any[]) => never
    }
}

export default fp(errorHandlerPlugin)
export { errorHandlerPlugin }
