import 'express-async-errors'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { logger } from './lib/logger'
import { errorHandler } from './middleware/error.middleware'
import { healthRouter } from './routes/health.routes'
import { authRouter } from './routes/auth.routes'
import { preferencesRouter } from './routes/preferences.routes'


const app = express();

const PORT = process.env.PORT || 3001;

// middleware 

app.use(cors({ origin: process.env.WEB_URL || 'http://localhost:5173' }))
app.use(express.json())


// routes 

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/preferences', preferencesRouter)

// Error handler — must be last
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`)
})

export default app

