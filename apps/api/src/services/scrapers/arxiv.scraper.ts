// apps/api/src/services/scrapers/arxiv.scraper.ts

import axios from 'axios'
import { logger } from '../../lib/logger'
import type { RawArticle } from './hackernews.scraper'

// Helper to extract text from XML tags
// We do this manually to avoid adding an XML parser dependency
function extractXml(xml: string, tag: string): string | null {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
    return match ? match[1].trim() : null
}

export async function scrapeArxiv(): Promise<RawArticle[]> {
    logger.info('Scraping ArXiv...')

    try {
        // Query the ArXiv API for recent papers across three AI categories
        // max_results=30 is a good balance — enough variety without too many tokens
        const url =
            'https://export.arxiv.org/api/query?' +
            'search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL' +
            '&sortBy=submittedDate' +
            '&sortOrder=descending' +
            '&max_results=30'

        const { data: xml } = await axios.get(url, { timeout: 15000 })

        // Split the XML response into individual <entry> blocks
        const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []

        const articles: RawArticle[] = []

        for (const entryXml of entryMatches) {
            const title = extractXml(entryXml, 'title')
            const summary = extractXml(entryXml, 'summary')
            const id = extractXml(entryXml, 'id')
            const published = extractXml(entryXml, 'published')

            // Skip entries missing required fields
            if (!title || !summary || !id) continue

            // Clean up whitespace that ArXiv sometimes includes in titles
            const cleanTitle = title.replace(/\s+/g, ' ').trim()
            const cleanSummary = summary.replace(/\s+/g, ' ').trim()

            // The content we send to LLM = title + abstract
            // Abstracts are perfect for this — they're designed to be self-contained summaries
            const content = `${cleanTitle}. Abstract: ${cleanSummary}`

            articles.push({
                title: cleanTitle,
                url: id,            // ArXiv ID is a URL: http://arxiv.org/abs/2401.xxxxx
                source: 'arxiv',
                content,
                publishedAt: published ? new Date(published) : new Date()
            })
        }

        logger.info(`ArXiv: found ${articles.length} papers`)
        return articles

    } catch (err) {
        logger.error({ err }, 'ArXiv scraper failed')
        return []
    }
}