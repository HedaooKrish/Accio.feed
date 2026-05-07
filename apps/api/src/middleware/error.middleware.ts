import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../lib/logger'

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            data: null,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: err.flatten()
            }
        })
    }

    // Everything else
    logger.error({ err, path: req.path }, 'Unhandled error')

    return res.status(500).json({
        data: null,
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR'
        }
    })
}