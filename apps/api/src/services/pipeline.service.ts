// apps/api/src/services/pipeline.service.ts

import { db } from '../lib/db'
import { logger } from '../lib/logger'
import { analyzeArticle } from './llm.service'
import { scrapeHackerNews } from './scrapers/hackernews.scraper'
import { scrapeArxiv } from './scrapers/arxiv.scraper'
import { scrapeVentureBeat } from './scrapers/venturebeat.scraper'

async function cleanupOldArticles() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

    // Delete digest article links first — foreign key constraint
    await db.digestArticle.deleteMany({
        where: {
            article: {
                publishedAt: { lt: cutoff }
            }
        }
    })

    // Now delete the articles themselves
    const { count } = await db.article.deleteMany({
        where: {
            publishedAt: { lt: cutoff }
        }
    })

    if (count > 0) {
        logger.info(`Cleanup: deleted ${count} articles older than 30 days`)
    }
}

export async function runScrapingPipeline(): Promise<void> {
    const startTime = Date.now()
    logger.info('Pipeline: starting')

    // Run all three scrapers simultaneously
    // If one fails it returns [] — the others still complete
    const [hnArticles, arxivArticles, vbArticles] = await Promise.all([
        scrapeHackerNews(),
        scrapeArxiv(),
        scrapeVentureBeat()
    ])

    const allArticles = [...hnArticles, ...arxivArticles, ...vbArticles]
    logger.info(`Pipeline: scraped ${allArticles.length} total articles`)

    let savedCount = 0
    let processedCount = 0
    let skippedCount = 0

    for (const article of allArticles) {
        try {
            // Dedup check — have we seen this URL before?
            const existing = await db.article.findUnique({
                where: { url: article.url },
                select: { id: true } // only fetch id — faster than full record
            })

            if (existing) {
                skippedCount++
                continue // already in DB, skip it
            }

            // Save the raw article immediately
            // processedAt is null — signals "not yet analyzed by LLM"
            const saved = await db.article.create({
                data: {
                    title: article.title,
                    url: article.url,
                    source: article.source,
                    rawContent: article.content,
                    publishedAt: article.publishedAt,
                }
            })

            savedCount++
            logger.info({ title: article.title }, 'Saved new article')

            // Send to Gemini for analysis
            // Small delay between LLM calls to avoid rate limiting
            await new Promise(r => setTimeout(r, 500))
            const analysis = await analyzeArticle(article.title, article.content)

            if (analysis) {
                // Update article with LLM results — now it's ready for the feed
                await db.article.update({
                    where: { id: saved.id },
                    data: {
                        summary: analysis.summary,
                        tags: analysis.tags,
                        technicalDepth: analysis.technicalDepth,
                        processedAt: new Date() // marks it as ready to show on feed
                    }
                })
                processedCount++
            }

        } catch (err) {
            // One article failing should never stop the rest
            logger.error({ err, url: article.url }, 'Failed to process article — skipping')
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    // apps/api/src/services/pipeline.service.ts
    // Add this function and call it at the end of runScrapingPipeline

    async function processUnanalyzedArticles() {
        // Find articles saved but never processed by LLM
        const unprocessed = await db.article.findMany({
            where: { processedAt: null },
            select: { id: true, title: true, rawContent: true },
            take: 50
        })

        if (unprocessed.length === 0) return

        logger.info(`Reprocessing ${unprocessed.length} unanalyzed articles...`)

        for (const article of unprocessed) {
            try {
                await new Promise(r => setTimeout(r, 500))
                const analysis = await analyzeArticle(article.title, article.rawContent || article.title)

                if (analysis) {
                    await db.article.update({
                        where: { id: article.id },
                        data: {
                            summary: analysis.summary,
                            tags: analysis.tags,
                            technicalDepth: analysis.technicalDepth,
                            processedAt: new Date()
                        }
                    })
                    logger.info({ title: article.title }, 'Reprocessed article')
                }
            } catch (err) {
                logger.error({ err, title: article.title }, 'Reprocess failed')
            }
        }
    }

    // bottom of runScrapingPipeline, before the final logger.info
    await processUnanalyzedArticles()
    await cleanupOldArticles()  

    logger.info(
        `Pipeline complete in ${duration}s: ` +
        `${savedCount} saved, ${processedCount} analyzed, ${skippedCount} skipped`
    )
}