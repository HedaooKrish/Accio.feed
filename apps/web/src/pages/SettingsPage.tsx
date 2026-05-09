// apps/web/src/pages/SettingsPage.tsx

import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth.store'
import { useNavigate } from 'react-router-dom'

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

export function SettingsPage() {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [depth, setDepth] = useState(2)
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const logout = useAuthStore(state => state.logout)
    const user = useAuthStore(state => state.user)
    const navigate = useNavigate()

    // Load existing preferences when page mounts
    useEffect(() => {
        api.get('/preferences')
            .then(res => {
                if (res.data.data) {
                    setSelectedTopics(res.data.data.topics)
                    setDepth(res.data.data.minTechnicalDepth)
                    setFrequency(res.data.data.digestFrequency)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    function toggleTopic(id: string) {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    async function handleSave() {
        if (selectedTopics.length === 0) {
            setError('Pick at least one topic')
            return
        }

        setSaving(true)
        setError('')

        try {
            await api.put('/preferences', {
                topics: selectedTopics,
                minTechnicalDepth: depth,
                digestFrequency: frequency
            })
            setSaved(true)
            // Hide the success message after 2 seconds
            setTimeout(() => setSaved(false), 2000)
        } catch {
            setError('Failed to save. Please try again.')
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
                <p style={{ color: '#999' }}>Loading...</p>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fafafa', padding: '3rem 1rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '2.5rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '1.5rem', fontWeight: '600', color: '#111',
                            marginBottom: '0.25rem'
                        }}>Settings</h1>
                        <p style={{ fontSize: '0.875rem', color: '#888' }}>{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px',
                        background: '#fff',
                        fontSize: '0.875rem',
                        color: '#666',
                        cursor: 'pointer',
                    }}>
                        Sign out
                    </button>
                </div>

                {/* Topics */}
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '0.95rem', fontWeight: '600', color: '#111',
                        marginBottom: '0.75rem'
                    }}>Topics</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                        {TOPICS.map(topic => {
                            const isSelected = selectedTopics.includes(topic.id)
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    style={{
                                        padding: '0.4rem 0.9rem',
                                        border: `1px solid ${isSelected ? '#111' : '#e5e5e5'}`,
                                        borderRadius: '100px',
                                        background: isSelected ? '#111' : '#fff',
                                        color: isSelected ? '#fff' : '#444',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {topic.label}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Depth */}
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '0.95rem', fontWeight: '600', color: '#111',
                        marginBottom: '0.75rem'
                    }}>Minimum technical depth</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                        {[1, 2, 3, 4, 5].map(d => (
                            <button
                                key={d}
                                onClick={() => setDepth(d)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: `1px solid ${depth === d ? '#111' : '#e5e5e5'}`,
                                    borderRadius: '8px',
                                    background: depth === d ? '#111' : '#fff',
                                    color: depth === d ? '#fff' : '#444',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                }}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Frequency */}
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '0.95rem', fontWeight: '600', color: '#111',
                        marginBottom: '0.75rem'
                    }}>Digest frequency</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['daily', 'weekly'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFrequency(f)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    border: `1px solid ${frequency === f ? '#111' : '#e5e5e5'}`,
                                    borderRadius: '8px',
                                    background: frequency === f ? '#111' : '#fff',
                                    color: frequency === f ? '#fff' : '#444',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                {f === 'daily' ? 'Daily' : 'Weekly'}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #e5e5e5', margin: '2rem 0' }} />

                {error && <p style={{
                    color: '#c0392b', fontSize: '0.85rem',
                    marginBottom: '1rem'
                }}>{error}</p>}
                {saved && <p style={{
                    color: '#27ae60', fontSize: '0.85rem',
                    marginBottom: '1rem'
                }}>Saved!</p>}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: '0.75rem 2rem',
                        background: '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                    }}
                >
                    {saving ? 'Saving...' : 'Save changes'}
                </button>

            </div>
        </div>
    )
}