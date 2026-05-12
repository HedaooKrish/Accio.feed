// apps/api/src/routes/articles.routes.ts

import { Router } from 'express'
import { db } from '../lib/db'
import { requireAuth } from '../middleware/auth.middleware'

export const articlesRouter = Router()

// GET /articles — paginated feed with optional tag and depth filters
// Query params: ?tags=llm,tooling  ?depth=3  ?page=2
articlesRouter.get('/', requireAuth, async (req, res) => {
    const page = Math.max(1, parseInt(String(req.query.page || '1')))
    const limit = 20

    // Parse comma-separated tags: "llm,tooling" → ["llm", "tooling"]
    const tags = req.query.tags
        ? String(req.query.tags).split(',').filter(Boolean)
        : undefined

    const depth = req.query.depth
        ? parseInt(String(req.query.depth))
        : undefined

    const articles = await db.article.findMany({
        where: {
            processedAt: { not: null },  // only show LLM-analyzed articles
            ...(tags?.length && { tags: { hasSome: tags } }),
            ...(depth && { technicalDepth: { gte: depth } }),
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        // Only select fields the frontend needs — don't send rawContent
        select: {
            id: true,
            title: true,
            url: true,
            source: true,
            summary: true,
            tags: true,
            technicalDepth: true,
            publishedAt: true,
        }
    })

    res.json({ data: articles, error: null })
})

// GET /articles/:id — single article with full content
articlesRouter.get('/:id', requireAuth, async (req, res) => {
    const article = await db.article.findUnique({
        where: { id: req.params.id }
    })

    if (!article) {
        return res.status(404).json({
            data: null,
            error: { message: 'Article not found', code: 'NOT_FOUND' }
        })
    }

    res.json({ data: article, error: null })
})