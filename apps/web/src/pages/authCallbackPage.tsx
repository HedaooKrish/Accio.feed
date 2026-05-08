import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth.store'

export function AuthCallbackPage() {
    const navigate = useNavigate()
    const setUser = useAuthStore(state => state.setUser)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(
                    { id: session.user.id, email: session.user.email! },
                    session.access_token
                )
                // First time login → go to onboarding to pick topics
                navigate('/onboarding')
            } else {
                // Something went wrong → back to login
                navigate('/login')
            }
        })
    }, [])
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa'
        }}>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Verifying your account...
            </p>
        </div>
    )
}