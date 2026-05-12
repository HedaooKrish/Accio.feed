// apps/api/src/services/scrapers/venturebeat.scraper.ts

import axios from 'axios'
import * as cheerio from 'cheerio'
import { logger } from '../../lib/logger'
import type { RawArticle } from './hackernews.scraper'

export async function scrapeVentureBeat(): Promise<RawArticle[]> {
    logger.info('Scraping VentureBeat...')

    try {
        const { data: html } = await axios.get(
            'https://venturebeat.com/category/ai/',
            {
                headers: {
                    // Without a User-Agent header, many sites return a 403
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                },
                timeout: 15000
            }
        )

        // Load HTML into Cheerio — $ works like jQuery selectors
        const $ = cheerio.load(html)
        const articles: RawArticle[] = []

        // VentureBeat article cards — each is an <article> element
        // We take the first 15 to avoid processing too many
        $('article').slice(0, 15).each((_, el) => {
            // Find the title link — could be in h2 or h3
            const titleEl = $(el).find('h2 a, h3 a').first()
            const title = titleEl.text().trim()
            const url = titleEl.attr('href')

            // First paragraph is usually the article excerpt
            const excerpt = $(el).find('p').first().text().trim()

            // <time> element has a datetime attribute in ISO format
            const dateStr = $(el).find('time').attr('datetime')

            // Skip cards without a title or URL
            if (!title || !url) return

            articles.push({
                title,
                url,
                source: 'venturebeat',
                content: excerpt || title, // fallback to title if no excerpt
                publishedAt: dateStr ? new Date(dateStr) : new Date()
            })
        })

        logger.info(`VentureBeat: found ${articles.length} articles`)
        return articles

    } catch (err) {
        logger.error({ err }, 'VentureBeat scraper failed')
        return []
    }
}