// apps/api/src/lib/scheduler.ts

import cron from 'node-cron'
import { logger } from './logger'
import { runScrapingPipeline } from '../services/pipeline.service'

// Track if pipeline is currently running to prevent overlapping runs
let isRunning = false

async function safePipelineRun() {
    if (isRunning) {
        logger.warn('Pipeline already running — skipping this trigger')
        return
    }

    isRunning = true
    try {
        await runScrapingPipeline()
    } finally {
        isRunning = false // always release the lock, even if pipeline throws
    }
}

export function startScheduler() {
    // Run every 6 hours: 0:00, 6:00, 12:00, 18:00
    cron.schedule('0 7,19 * * *', () => {
        logger.info('Cron: triggering scheduled pipeline run')
        safePipelineRun()
    })

    logger.info('Scheduler started — pipeline runs every 12 hours')

    // Run once immediately on startup so the feed isn't empty on first load
    // Small delay to let the server fully start first
    setTimeout(() => {
        logger.info('Running initial pipeline on startup...')
        safePipelineRun()
    }, 3000)
}