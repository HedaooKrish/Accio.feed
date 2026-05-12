// apps/api/src/services/scrapers/hackernews.scraper.ts

import axios from 'axios'
import { logger } from '../../lib/logger'

// Every scraper returns this same shape
// The pipeline service works with RawArticle regardless of source
export interface RawArticle {
    title: string
    url: string
    source: 'hackernews' | 'arxiv' | 'venturebeat'
    content: string   // raw text sent to LLM for analysis
    publishedAt: Date
}

// Keywords that signal an AI-relevant story
// We filter HN's top 50 stories down to only these
const AI_KEYWORDS = [
    'ai', 'llm', 'gpt', 'claude', 'gemini', 'mistral', 'llama',
    'machine learning', 'neural', 'openai', 'anthropic', 'deepmind',
    'artificial intelligence', 'transformer', 'diffusion', 'model',
    'arxiv', 'benchmark', 'fine-tun', 'embedding', 'inference',
    'chatgpt', 'copilot', 'hugging face', 'nvidia', 'gpu', 'cuda'
]

function isAIRelated(title: string): boolean {
    const lower = title.toLowerCase()
    return AI_KEYWORDS.some(keyword => lower.includes(keyword))
}

export async function scrapeHackerNews(): Promise<RawArticle[]> {
    logger.info('Scraping HackerNews...')

    try {
        // Step 1: Get the top 500 story IDs from HN's Firebase API
        const { data: ids } = await axios.get<number[]>(
            'https://hacker-news.firebaseio.com/v0/topstories.json',
            { timeout: 10000 }
        )

        // Only check top 50 — beyond that stories are too old or low-quality
        const topIds = ids.slice(0, 50)

        // Step 2: Fetch all stories in parallel
        // Promise.allSettled means if one fails, the rest still complete
        const results = await Promise.allSettled(
            topIds.map(id =>
                axios.get(
                    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
                    { timeout: 5000 }
                ).then(r => r.data)
            )
        )

        const articles: RawArticle[] = []

        for (const result of results) {
            // Skip failed requests
            if (result.status === 'rejected') continue

            const story = result.value

            // Skip: no story, no URL (text posts), dead/deleted posts, not AI related
            if (!story || !story.url || story.dead || story.deleted) continue
            if (!isAIRelated(story.title)) continue

            // We don't have article body content from HN API
            // So we use the title + metadata as context for the LLM
            // This is enough for Gemini to categorize and summarize the topic
            const content = [
                story.title,
                `${story.score || 0} upvotes on Hacker News`,
                `${story.descendants || 0} comments`,
            ].join('. ')

            articles.push({
                title: story.title,
                url: story.url,
                source: 'hackernews',
                content,
                publishedAt: new Date(story.time * 1000) // HN uses Unix timestamps
            })
        }

        logger.info(`HackerNews: found ${articles.length} AI-related articles`)
        return articles

    } catch (err) {
        // Scraper failure is non-fatal — log and return empty array
        // Pipeline continues with the other two sources
        logger.error({ err }, 'HackerNews scraper failed')
        return []
    }
}