// Signup page

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'

export function Signup() {
    // initial state

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(false) // true after successful signup
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // After clicking the email link, redirect here
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        setDone(true)
    }
    if (done) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Check your email</h1>
                    <p style={styles.subtitle}>
                        We sent a verification link to <strong>{email}</strong>.
                        Click it to activate your account.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={styles.title}>Create account</h1>
                    <p style={styles.subtitle}>Get your daily AI news digest</p>
                </div>

                {/* Form */}
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
                        />
                    </div>

                    {/* Show error if signup fails */}
                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>

            </div>
        </div>
    )
}

// Inline styles — keeps everything in one file, easy to follow
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: '#fafafa',
    },
    card: {
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '0.25rem',
        color: '#111',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#666',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.25rem',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.4rem',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        padding: '0.65rem 0.85rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        background: '#fff',
        color: '#111',
        transition: 'border-color 0.15s',
    },
    button: {
        padding: '0.75rem',
        background: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    error: {
        fontSize: '0.85rem',
        color: '#c0392b',
        background: '#fdf0ee',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
    },
    footer: {
        marginTop: '1.5rem',
        fontSize: '0.85rem',
        color: '#666',
        textAlign: 'center' as const,
    }

}