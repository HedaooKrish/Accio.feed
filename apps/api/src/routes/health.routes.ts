import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', async (req, res) => {
    res.json({
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        },
        error: null
    })
})