// apps/web/src/pages/OnboardingPage.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

// All available topics — matches our Prisma schema and Zod validator
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

// Depth levels — shown as selectable cards
const DEPTH_LEVELS = [
    { value: 1, label: 'Beginner', desc: 'News, announcements, product launches' },
    { value: 2, label: 'General', desc: 'Some technical context, no deep math' },
    { value: 3, label: 'Intermediate', desc: 'Engineering detail, architecture decisions' },
    { value: 4, label: 'Advanced', desc: 'Research papers, model internals' },
    { value: 5, label: 'Expert', desc: 'ArXiv papers, benchmarks, proofs' },
]

export function OnboardingPage() {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [depth, setDepth] = useState(2)
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Toggle a topic on or off
    function toggleTopic(id: string) {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    async function handleSubmit() {
        if (selectedTopics.length === 0) {
            setError('Please pick at least one topic')
            return
        }

        setLoading(true)
        setError('')

        try {
            await api.put('/preferences', {
                topics: selectedTopics,
                minTechnicalDepth: depth,
                digestFrequency: frequency
            })

            // Preferences saved — head to the feed
            navigate('/feed')
        } catch (err: any) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Set up your digest</h1>
                    <p style={styles.subtitle}>
                        Tell us what you care about. Your daily email will be built around this.
                    </p>
                </div>

                {/* Topic picker */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Topics</h2>
                    <p style={styles.sectionDesc}>Pick everything you want to follow</p>
                    <div style={styles.topicGrid}>
                        {TOPICS.map(topic => {
                            const isSelected = selectedTopics.includes(topic.id)
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTopic(topic.id)}
                                    style={{
                                        ...styles.topicChip,
                                        ...(isSelected ? styles.topicChipSelected : {})
                                    }}
                                >
                                    {topic.label}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Technical depth */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Technical depth</h2>
                    <p style={styles.sectionDesc}>
                        Filter out content that's too shallow or too deep for you
                    </p>
                    <div style={styles.depthGrid}>
                        {DEPTH_LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => setDepth(level.value)}
                                style={{
                                    ...styles.depthCard,
                                    ...(depth === level.value ? styles.depthCardSelected : {})
                                }}
                            >
                                <span style={styles.depthLabel}>{level.label}</span>
                                <span style={styles.depthDesc}>{level.desc}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Digest frequency */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Digest frequency</h2>
                    <p style={styles.sectionDesc}>How often do you want the email?</p>
                    <div style={styles.freqRow}>
                        {(['daily', 'weekly'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFrequency(f)}
                                style={{
                                    ...styles.freqBtn,
                                    ...(frequency === f ? styles.freqBtnSelected : {})
                                }}
                            >
                                {f === 'daily' ? 'Daily' : 'Weekly'}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Error */}
                {error && <p style={styles.error}>{error}</p>}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={styles.submitBtn}
                >
                    {loading ? 'Saving...' : 'Start my digest →'}
                </button>

            </div>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#fafafa',
        padding: '3rem 1rem',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '2.5rem',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '600',
        color: '#111',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: '#666',
        lineHeight: '1.6',
    },
    section: {
        marginBottom: '2.5rem',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#111',
        marginBottom: '0.25rem',
    },
    sectionDesc: {
        fontSize: '0.85rem',
        color: '#888',
        marginBottom: '1rem',
    },
    topicGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
    },
    topicChip: {
        padding: '0.45rem 1rem',
        border: '1px solid #e5e5e5',
        borderRadius: '100px',
        background: '#fff',
        fontSize: '0.875rem',
        color: '#444',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    topicChipSelected: {
        background: '#111',
        color: '#fff',
        border: '1px solid #111',
    },
    depthGrid: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
    },
    depthCard: {
        padding: '0.85rem 1rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        background: '#fff',
        textAlign: 'left' as const,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.2rem',
        transition: 'all 0.15s',
    },
    depthCardSelected: {
        border: '1px solid #111',
        background: '#fafafa',
    },
    depthLabel: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#111',
    },
    depthDesc: {
        fontSize: '0.8rem',
        color: '#888',
    },
    freqRow: {
        display: 'flex',
        gap: '0.75rem',
    },
    freqBtn: {
        padding: '0.65rem 1.5rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '0.9rem',
        color: '#444',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    freqBtnSelected: {
        background: '#111',
        color: '#fff',
        border: '1px solid #111',
    },
    error: {
        fontSize: '0.85rem',
        color: '#c0392b',
        background: '#fdf0ee',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        background: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
    },
}