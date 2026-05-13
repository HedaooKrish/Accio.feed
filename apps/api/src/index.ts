// apps/api/src/index.ts

import 'express-async-errors'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { logger } from './lib/logger'
import { errorHandler } from './middleware/error.middleware'
import { startScheduler } from './lib/scheduler'
import { runScrapingPipeline } from './services/pipeline.service'

// Routes
import { healthRouter } from './routes/health.routes'
import { authRouter } from './routes/auth.routes'
import { preferencesRouter } from './routes/preferences.routes'
import { articlesRouter } from './routes/articles.routes'
import { digestsRouter } from './routes/digest.routes'
import { sendDailyDigests } from './services/digest.service'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: process.env.WEB_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/health', healthRouter)
app.use('/auth', authRouter)
app.use('/preferences', preferencesRouter)
app.use('/articles', articlesRouter)
app.use('/digests', digestsRouter)


// Manual pipeline trigger — dev only
// Lets you run the scraper without waiting 6 hours
app.post('/pipeline/run', async (req, res) => {
    logger.info('Manual pipeline trigger')
    runScrapingPipeline() // intentionally not awaited — runs in background
    res.json({ data: { message: 'Pipeline started in background' }, error: null })
})

app.post('/digest/send', async (req, res) => {
    sendDailyDigests() // runs in background
    res.json({ data: { message: 'Digest send started' }, error: null })
})

// Error handler — must be last
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`)
    startScheduler() // starts cron + runs pipeline once on boot
})

export default app