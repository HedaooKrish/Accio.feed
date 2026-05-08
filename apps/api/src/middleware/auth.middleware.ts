import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase'

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
            }
        }
    }
}

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // tokens are sent in the authorization header as "Bearer <token>"
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            data: null,
            error: {
                message: 'No token provided',
                code: 'Unauthorized'
            }
        })
    }

    // extracting the tokens
    const token = authHeader.split(' ')[1]

    // Asking Supabase to verify the token and return the user
    // the line below, if the token is valid will return the user
    // getUser is an inbuild supabase auth function
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        return res.status(401).json({
            data: null,
            error: {
                message: 'Invalid or expired token',
                code: 'UNAUTHORIZED'
            }
        })
    }
    req.user = {
        id: user.id,
        email: user.email!
    }
    next();
}