// apps/web/src/pages/signupPage.tsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })

        setLoading(false)
        if (error) { setError(error.message); return }
        setDone(true)
    }

    if (done) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex',
                alignItems: 'center', justifyContent: 'center', background: '#fafafa'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✉️</div>
                    <h1 style={{
                        fontSize: '1.25rem', fontWeight: '600',
                        color: '#0a0a0a', marginBottom: '0.5rem'
                    }}>
                        Check your inbox
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#71717a', lineHeight: '1.6' }}>
                        We sent a verification link to <strong>{email}</strong>.
                        Click it to activate your account.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.page}>

            <div style={styles.left}>
                <div style={styles.leftInner}>
                    <Link to="/" style={styles.backLink}>← Back</Link>
                    <div style={styles.wordmark}>Holonet.ai</div>
                    <p style={styles.tagline}>
                        Stop missing<br />what matters in AI.
                    </p>
                    <ul style={styles.featureList}>
                        {[
                            'Scraped every 12 hours',
                            'Summarized by AI',
                            'Filtered to your interests',
                            'In your inbox by 8am',
                        ].map(f => (
                            <li key={f} style={styles.featureItem}>
                                <span style={styles.featureDot}>→</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={styles.right}>
                <div style={styles.formBox}>

                    <div style={styles.formHeader}>
                        <h1 style={styles.formTitle}>Create account</h1>
                        <p style={styles.formSubtitle}>Free forever. No credit card.</p>
                    </div>

                    <form onSubmit={handleSignup} style={styles.form}>
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
                                placeholder="Min 6 characters"
                                required
                                minLength={6}
                                style={styles.input}
                                onFocus={e => e.target.style.borderColor = '#0a0a0a'}
                                onBlur={e => e.target.style.borderColor = '#e4e4e7'}
                            />
                        </div>

                        {error && (
                            <div style={styles.errorBox}>{error}</div>
                        )}

                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p style={styles.switchText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
    featureList: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.75rem',
    },
    featureItem: {
        fontSize: '0.875rem',
        color: '#a0a0ab',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    featureDot: {
        color: '#52525b',
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