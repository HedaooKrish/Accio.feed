// apps/api/src/lib/scheduler.ts — add digest cron

import cron from 'node-cron'
import { logger } from './logger'
import { runScrapingPipeline } from '../services/pipeline.service'
import { sendDailyDigests } from '../services/digest.service'  // add this

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
        isRunning = false
    }
}

export function startScheduler() {
    // Scraping pipeline — 7am and 7pm
    cron.schedule('0 7,19 * * *', () => {
        logger.info('Cron: starting scraping pipeline')
        safePipelineRun()
    })

    // Daily digest — every morning at 8am
    // Runs after the 7am scrape so fresh articles are included
    cron.schedule('0 8 * * *', () => {
        logger.info('Cron: sending daily digests')
        sendDailyDigests()
    })

    logger.info('Scheduler started')
}