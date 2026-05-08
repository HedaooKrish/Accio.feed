import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { supabase } from '../lib/supabase'

export const authRouter = Router()

// GET /auth/me — returns the currently logged in user
// Protected: requires a valid JWT token
authRouter.get('/me', requireAuth, async (req, res) => {
    res.json({
        data: {
            id: req.user!.id,
            email: req.user!.email
        },
        error: null
    })
})

// POST /auth/logout — invalidates the user's session on the server
authRouter.post('/logout', requireAuth, async (req, res) => {
    const token = req.headers.authorization!.split(' ')[1]

    //telling supabase to invalidate the token
    await supabase.auth.admin.signOut(token)

    res.json({
        data: {
            message: 'Logged out successfully',
            error: null
        }
    })
})

