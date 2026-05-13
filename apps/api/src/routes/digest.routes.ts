// apps/api/src/routes/digests.routes.ts

import { Router } from 'express'
import { db } from '../lib/db'
import { requireAuth } from '../middleware/auth.middleware'

export const digestsRouter = Router()

// GET /digests — list all digests for current user
digestsRouter.get('/', requireAuth, async (req, res) => {
    const digests = await db.digest.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        include: {
            articles: {
                include: { article: true },
                orderBy: { rank: 'asc' }
            }
        }
    })

    res.json({ data: digests, error: null })
})

// GET /digests/:id — single digest for archive view
digestsRouter.get('/:id', requireAuth, async (req, res) => {
    const digest = await db.digest.findFirst({
        where: {
            id: req.params.id,
            userId: req.user!.id  // ensure user owns this digest
        },
        include: {
            articles: {
                include: { article: true },
                orderBy: { rank: 'asc' }
            }
        }
    })

    if (!digest) {
        return res.status(404).json({
            data: null,
            error: { message: 'Digest not found', code: 'NOT_FOUND' }
        })
    }

    res.json({ data: digest, error: null })
})