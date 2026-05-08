import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        setLoading(false)
        if (error) {
            setError(error.message)
            return
        }

        setUser(
            { id: data.user.id, email: data.user.email! },
            data.session.access_token
        )

        // Redirect to feed after login
        navigate('/feed')
    }
    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={styles.title}>Welcome back</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
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
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Your password"
                            required
                            style={styles.input}
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/signup">Create one</Link>
                </p>

            </div>
        </div>
    )
}

// Same styles as SignupPage — you can extract these to a shared file later
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