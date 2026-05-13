// apps/web/src/pages/SettingsPage.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth.store'

const TOPICS = [
    { id: 'llm', label: 'LLMs' },
    { id: 'model-release', label: 'Model releases' },
    { id: 'research-paper', label: 'Research papers' },
    { id: 'open-source', label: 'Open source' },
    { id: 'computer-vision', label: 'Computer vision' },
    { id: 'policy', label: 'AI policy' },
    { id: 'startup-funding', label: 'Startup funding' },
    { id: 'tooling', label: 'Developer tooling' },
    { id: 'robotics', label: 'Robotics' },
    { id: 'multimodal', label: 'Multimodal' },
]

const DEPTH_LABELS: Record<number, string> = {
    1: 'General news',
    2: 'Some technical context',
    3: 'Engineering detail',
    4: 'Research level',
    5: 'ArXiv papers',
}

export function SettingsPage() {
    const [topics, setTopics] = useState<string[]>([])
    const [depth, setDepth] = useState(2)
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/preferences').then(res => {
            if (res.data.data) {
                setTopics(res.data.data.topics)
                setDepth(res.data.data.minTechnicalDepth)
                setFrequency(res.data.data.digestFrequency)
            }
        }).finally(() => setLoading(false))
    }, [])

    function toggleTopic(id: string) {
        setTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    async function handleSave() {
        if (topics.length === 0) { setError('Pick at least one topic'); return }
        setSaving(true); setError('')
        try {
            await api.put('/preferences', {
                topics, minTechnicalDepth: depth, digestFrequency: frequency
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch {
            setError('Failed to save. Try again.')
        } finally {
            setSaving(false)
        }
    }

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#fafafa'
            }}>
                <p style={{ color: '#a0a0ab', fontSize: '0.875rem' }}>Loading...</p>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fafafa' }}>

            {/* Navbar */}
            <nav style={styles.nav}>
                <div style={styles.navInner}>
                    <Link to="/feed" style={styles.navLogo}>Holonet.ai</Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/feed" style={styles.navLink}>← Feed</Link>
                        <button onClick={handleLogout} style={styles.navBtn}>Sign out</button>
                    </div>
                </div>
            </nav>

            <div style={styles.container}>

                {/* Page header */}
                <div style={styles.pageHeader}>
                    <div>
                        <h1 style={styles.pageTitle}>Settings</h1>
                        <p style={styles.pageSubtitle}>{user?.email}</p>
                    </div>
                </div>

                {/* Topics section */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Topics</h2>
                        <p style={styles.cardDesc}>
                            Your digest only includes articles matching these topics
                        </p>
                    </div>
                    <div style={styles.chipGrid}>
                        {TOPICS.map(topic => {
                            const active = topics.includes(topic.id)
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    style={{
                                        ...styles.chip,
                                        background: active ? '#0a0a0a' : '#ffffff',
                                        color: active ? '#ffffff' : '#52525b',
                                        border: `1px solid ${active ? '#0a0a0a' : '#e4e4e7'}`,
                                    }}
                                >
                                    {topic.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Depth section */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Technical depth</h2>
                        <p style={styles.cardDesc}>
                            Currently set to: <strong>{DEPTH_LABELS[depth]}</strong>
                        </p>
                    </div>
                    <div style={styles.depthRow}>
                        {[1, 2, 3, 4, 5].map(d => (
                            <button
                                key={d}
                                onClick={() => setDepth(d)}
                                style={{
                                    ...styles.depthBtn,
                                    background: depth === d ? '#0a0a0a' : '#ffffff',
                                    color: depth === d ? '#ffffff' : '#52525b',
                                    border: `1px solid ${depth === d ? '#0a0a0a' : '#e4e4e7'}`,
                                }}
                            >
                                <span style={{ fontSize: '1rem', fontWeight: '600' }}>{d}</span>
                                <span style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '2px' }}>
                                    {['News', 'General', 'Eng', 'Research', 'ArXiv'][d - 1]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frequency section */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Digest frequency</h2>
                        <p style={styles.cardDesc}>How often you receive the email</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {(['daily', 'weekly'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFrequency(f)}
                                style={{
                                    ...styles.freqBtn,
                                    background: frequency === f ? '#0a0a0a' : '#ffffff',
                                    color: frequency === f ? '#ffffff' : '#52525b',
                                    border: `1px solid ${frequency === f ? '#0a0a0a' : '#e4e4e7'}`,
                                }}
                            >
                                {f === 'daily' ? 'Daily' : 'Weekly'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save */}
                <div style={styles.saveRow}>
                    {error && <p style={styles.errorText}>{error}</p>}
                    {saved && <p style={styles.successText}>Changes saved</p>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={styles.saveBtn}
                    >
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>

            </div>
        </div>
    )
}

const styles = {
    nav: {
        background: '#ffffff',
        borderBottom: '1px solid #e4e4e7',
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
    },
    navInner: {
        maxWidth: '680px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navLogo: {
        fontSize: '0.925rem',
        fontWeight: '600',
        color: '#0a0a0a',
        letterSpacing: '-0.01em',
    },
    navLink: {
        fontSize: '0.825rem',
        color: '#71717a',
    },
    navBtn: {
        fontSize: '0.825rem',
        color: '#71717a',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    container: {
        maxWidth: '680px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem 4rem',
    },
    pageHeader: {
        marginBottom: '2rem',
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#0a0a0a',
        letterSpacing: '-0.02em',
        marginBottom: '0.2rem',
    },
    pageSubtitle: {
        fontSize: '0.85rem',
        color: '#a0a0ab',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
    },
    cardHeader: {
        marginBottom: '1.25rem',
    },
    cardTitle: {
        fontSize: '0.925rem',
        fontWeight: '600',
        color: '#0a0a0a',
        marginBottom: '0.2rem',
        letterSpacing: '-0.01em',
    },
    cardDesc: {
        fontSize: '0.825rem',
        color: '#71717a',
    },
    chipGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
    },
    chip: {
        padding: '0.4rem 0.9rem',
        borderRadius: '100px',
        fontSize: '0.825rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.1s',
    },
    depthRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    depthBtn: {
        flex: 1,
        padding: '0.75rem 0.5rem',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '2px',
        transition: 'all 0.1s',
    },
    freqBtn: {
        padding: '0.6rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.1s',
    },
    saveRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    errorText: {
        fontSize: '0.825rem',
        color: '#dc2626',
    },
    successText: {
        fontSize: '0.825rem',
        color: '#16a34a',
    },
    saveBtn: {
        padding: '0.65rem 1.5rem',
        background: '#0a0a0a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        letterSpacing: '-0.01em',
    },
}