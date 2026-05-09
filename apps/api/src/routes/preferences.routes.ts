// apps/api/src/routes/preferences.routes.ts

import { Router } from 'express'
import { z } from 'zod'
import { db } from '../lib/db'
import { requireAuth } from '../middleware/auth.middleware'

export const preferencesRouter = Router()

// Zod schema — validates the request body shape and values
// If anything is wrong, Zod throws and our error middleware returns a 400
const PreferencesSchema = z.object({
    topics: z.array(z.enum([
        'llm', 'model-release', 'research-paper', 'open-source',
        'computer-vision', 'policy', 'startup-funding', 'tooling',
        'robotics', 'multimodal'
    ])).min(1, 'Pick at least one topic'),
    minTechnicalDepth: z.number().int().min(1).max(5),
    digestFrequency: z.enum(['daily', 'weekly'])
})

// GET /preferences — fetch current user's preferences
preferencesRouter.get('/', requireAuth, async (req, res) => {

    await db.user.upsert({
        where: { id: req.user!.id },
        update: {},
        create: {
            id: req.user!.id,
            email: req.user!.email
        }
    })
    const prefs = await db.userPreferences.findUnique({
        where: { userId: req.user!.id }
    })

    // No prefs yet means they haven't completed onboarding
    if (!prefs) {
        return res.json({ data: null, error: null })
    }

    res.json({ data: prefs, error: null })
})

// PUT /preferences — create or update preferences
// upsert = update if exists, create if not — handles both onboarding and settings
preferencesRouter.put('/', requireAuth, async (req, res) => {
    // Validate request body against our schema
    const body = PreferencesSchema.parse(req.body)

    await db.user.upsert({
        where: { id: req.user!.id },
        update: {},  // nothing to update on the user itself
        create: {
            id: req.user!.id,       // use the same ID as Supabase Auth
            email: req.user!.email
        }
    })

    const prefs = await db.userPreferences.upsert({
        where: { userId: req.user!.id },
        update: {
            topics: body.topics,
            minTechnicalDepth: body.minTechnicalDepth,
            digestFrequency: body.digestFrequency,
            updatedAt: new Date()
        },
        create: {
            userId: req.user!.id,
            topics: body.topics,
            minTechnicalDepth: body.minTechnicalDepth,
            digestFrequency: body.digestFrequency
        }
    })

    res.json({ data: prefs, error: null })
})