// apps/web/src/pages/loginPage.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth.store'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const setUser = useAuthStore(state => state.setUser)
    const navigate = useNavigate()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) { setError(error.message); return }

        setUser({ id: data.user.id, email: data.user.email! }, data.session.access_token)
        navigate('/feed')
    }

    return (
        <div style={styles.page}>

            {/* Left panel — branding */}
            <div style={styles.left}>
                <div style={styles.leftInner}>
                    <Link to="/" style={styles.backLink}>← Back</Link>
                    <div style={styles.wordmark}>Holonet.ai</div>
                    <p style={styles.tagline}>
                        The pulse of AI,<br />delivered every morning.
                    </p>
                    <div style={styles.sourceList}>
                        {['Hacker News', 'ArXiv', 'TechCrunch'].map(s => (
                            <span key={s} style={styles.sourceChip}>{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div style={styles.right}>
                <div style={styles.formBox}>

                    <div style={styles.formHeader}>
                        <h1 style={styles.formTitle}>Welcome back</h1>
                        <p style={styles.formSubtitle}>Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={styles.input}
                                onFocus={e => e.target.style.borderColor = '#0a0a0a'}
                                onBlur={e => e.target.style.borderColor = '#e4e4e7'}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={styles.input}
                                onFocus={e => e.target.style.borderColor = '#0a0a0a'}
                                onBlur={e => e.target.style.borderColor = '#e4e4e7'}
                            />
                        </div>

                        {error && <div style={styles.errorBox}>{error}</div>}

                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p style={styles.switchText}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={styles.switchLink}>Create one</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
    },
    left: {
        flex: 1,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
    } as React.CSSProperties,
    leftInner: {
        maxWidth: '360px',
    },
    wordmark: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '2rem',
        letterSpacing: '-0.02em',
    },
    tagline: {
        fontSize: '2.25rem',
        fontWeight: '600',
        color: '#ffffff',
        lineHeight: '1.2',
        letterSpacing: '-0.03em',
        marginBottom: '2rem',
    },
    sourceList: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
    },
    sourceChip: {
        fontSize: '0.75rem',
        color: '#71717a',
        border: '1px solid #27272a',
        borderRadius: '100px',
        padding: '0.3rem 0.75rem',
    },
    right: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: '#fafafa',
    } as React.CSSProperties,
    formBox: {
        width: '100%',
        maxWidth: '380px',
    },
    formHeader: {
        marginBottom: '2rem',
    },
    formTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#0a0a0a',
        letterSpacing: '-0.02em',
        marginBottom: '0.25rem',
    },
    formSubtitle: {
        fontSize: '0.875rem',
        color: '#71717a',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.1rem',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.4rem',
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: '500',
        color: '#3f3f46',
        letterSpacing: '0.01em',
    },
    input: {
        padding: '0.7rem 0.9rem',
        border: '1px solid #e4e4e7',
        borderRadius: '8px',
        fontSize: '0.925rem',
        outline: 'none',
        background: '#ffffff',
        color: '#0a0a0a',
        transition: 'border-color 0.15s',
        width: '100%',
    },
    errorBox: {
        fontSize: '0.825rem',
        color: '#dc2626',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
    },
    submitBtn: {
        padding: '0.75rem',
        background: '#0a0a0a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.925rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '0.25rem',
        letterSpacing: '-0.01em',
    },
    switchText: {
        marginTop: '1.5rem',
        fontSize: '0.85rem',
        color: '#71717a',
        textAlign: 'center' as const,
    },
    switchLink: {
        color: '#0a0a0a',
        fontWeight: '500',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
    },
    backLink: {
        fontSize: '0.8rem',
        color: '#52525b',
        display: 'inline-block',
        marginBottom: '2rem',
        letterSpacing: '0.01em',
    },
}