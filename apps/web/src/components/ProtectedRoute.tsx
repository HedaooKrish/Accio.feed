// apps/web/src/components/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface Props {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuthStore()

    // Still checking if a session exists — show nothing yet
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa'
            }}>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>Loading...</p>
            </div>
        )
    }

    // Not logged in — redirect to login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Logged in — render the page
    return <>{children}</>
}