// apps/web/src/pages/FeedPage.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth.store'

// Topic filter options — "All" has empty id which means no filter
const FILTERS = [
    { id: '', label: 'All' },
    { id: 'llm', label: 'LLMs' },
    { id: 'model-release', label: 'Releases' },
    { id: 'research-paper', label: 'Research' },
    { id: 'open-source', label: 'Open source' },
    { id: 'computer-vision', label: 'Vision' },
    { id: 'policy', label: 'Policy' },
    { id: 'startup-funding', label: 'Funding' },
    { id: 'tooling', label: 'Tooling' },
    { id: 'robotics', label: 'Robotics' },
    { id: 'multimodal', label: 'Multimodal' },
]

interface Article {
    id: string
    title: string
    url: string
    source: string
    summary: string
    tags: string[]
    technicalDepth: number
    publishedAt: string
}

// Color coding per source so users can scan quickly
const SOURCE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    hackernews: { bg: '#fff3e8', color: '#c45000', label: 'Hacker News' },
    arxiv: { bg: '#eef2ff', color: '#3730a3', label: 'ArXiv' },
    venturebeat: { bg: '#f0fdf4', color: '#166534', label: 'VentureBeat' },
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

export function FeedPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTag, setActiveTag] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [triggering, setTriggering] = useState(false)

    const logout = useAuthStore(state => state.logout)
    const navigate = useNavigate()

    useEffect(() => {
        fetchArticles(activeTag, page, page === 1)
    }, [activeTag, page])

    async function fetchArticles(tag: string, p: number, reset: boolean) {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (tag) params.set('tags', tag)
            params.set('page', String(p))

            const res = await api.get(`/articles?${params}`)
            const data = res.data.data as Article[]

            setArticles(prev => reset ? data : [...prev, ...data])
            setHasMore(data.length === 20)
        } finally {
            setLoading(false)
        }
    }

    function handleTagChange(tag: string) {
        setActiveTag(tag)
        setPage(1)
        // resetting page to 1 triggers the useEffect which fetches fresh
    }

    async function triggerPipeline() {
        setTriggering(true)
        await api.post('/pipeline/run')
        // Wait a few seconds then refresh — gives pipeline time to save first articles
        setTimeout(() => {
            fetchArticles('', 1, true)
            setActiveTag('')
            setTriggering(false)
        }, 5000)
    }

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fafafa' }}>

            {/* Sticky navbar */}
            <nav style={styles.nav}>
                <div style={styles.navInner}>
                    <span style={styles.logo}>AI Digest</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/settings" style={styles.navLink}>Settings</Link>
                        <button onClick={handleLogout} style={styles.ghostBtn}>
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <div style={styles.container}>

                {/* Page header */}
                <div style={styles.pageHeader}>
                    <h1 style={styles.pageTitle}>Your feed</h1>
                    <button
                        onClick={triggerPipeline}
                        disabled={triggering}
                        style={styles.refreshBtn}
                    >
                        {triggering ? 'Fetching...' : 'Refresh articles'}
                    </button>
                </div>

                {/* Topic filter pills */}
                <div style={styles.filterBar}>
                    {FILTERS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => handleTagChange(f.id)}
                            style={{
                                ...styles.pill,
                                ...(activeTag === f.id ? styles.pillActive : {})
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* States: loading, empty, list */}
                {loading && page === 1 ? (
                    <div style={styles.centered}>
                        <p style={{ color: '#999', fontSize: '0.9rem' }}>Loading...</p>
                    </div>

                ) : articles.length === 0 ? (
                    <div style={styles.centered}>
                        <p style={{ fontWeight: '500', color: '#333', marginBottom: '0.5rem' }}>
                            No articles yet
                        </p>
                        <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Click "Refresh articles" to fetch the latest AI news
                        </p>
                        <button onClick={triggerPipeline} disabled={triggering} style={styles.refreshBtn}>
                            {triggering ? 'Fetching... (takes ~30s)' : 'Fetch articles now'}
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Article list — separated by thin borders, not cards */}
                        <div style={styles.list}>
                            {articles.map(article => {
                                const src = SOURCE_STYLE[article.source]
                                return (
                                    <div key={article.id} style={styles.item}>

                                        {/* Meta row: source + time + depth */}
                                        <div style={styles.metaRow}>
                                            <span style={{
                                                ...styles.sourcePill,
                                                background: src?.bg || '#f5f5f5',
                                                color: src?.color || '#555',
                                            }}>
                                                {src?.label || article.source}
                                            </span>
                                            <span style={styles.meta}>
                                                {timeAgo(article.publishedAt)}
                                            </span>
                                            {/* Depth shown as filled dots */}
                                            <span style={styles.meta} title={`Technical depth: ${article.technicalDepth}/5`}>
                                                {'●'.repeat(article.technicalDepth || 1)}
                                                {'○'.repeat(5 - (article.technicalDepth || 1))}
                                            </span>
                                        </div>

                                        {/* Title — opens original article */}
                                        <h2 style={styles.title}>
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={styles.titleLink}
                                            >
                                                {article.title}
                                            </a>
                                        </h2>

                                        {/* Gemini summary */}
                                        {
                                            article.summary && (
                                                <p style={styles.summary}>{article.summary}</p>
                                            )
                                        }

                                        {/* Tags — clicking a tag filters the feed */}
                                        {
                                            article.tags?.length > 0 && (
                                                <div style={styles.tagRow}>
                                                    {article.tags.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => handleTagChange(tag)}
                                                            style={styles.tag}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            )
                                        }

                                    </div>
                                )
                            })}
                        </div>

                        {/* Load more */}
                        {hasMore && (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={loading}
                                    style={styles.loadMoreBtn}
                                >
                                    {loading ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div >
    )
}

const styles = {
    nav: {
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
    },
    navInner: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#111',
    },
    navLink: {
        fontSize: '0.875rem',
        color: '#666',
        textDecoration: 'none',
    },
    ghostBtn: {
        fontSize: '0.875rem',
        color: '#666',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    container: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#111',
    },
    refreshBtn: {
        padding: '0.5rem 1rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '0.8rem',
        color: '#555',
        cursor: 'pointer',
    },
    filterBar: {
        display: 'flex',
        gap: '0.4rem',
        flexWrap: 'wrap' as const,
        marginBottom: '1.5rem',
    },
    pill: {
        padding: '0.3rem 0.8rem',
        border: '1px solid #e5e5e5',
        borderRadius: '100px',
        background: '#fff',
        fontSize: '0.78rem',
        color: '#555',
        cursor: 'pointer',
        transition: 'all 0.1s',
    },
    pillActive: {
        background: '#111',
        color: '#fff',
        border: '1px solid #111',
    },
    centered: {
        textAlign: 'center' as const,
        padding: '5rem 0',
    },
    list: {
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    item: {
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #f0f0f0',
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.5rem',
    },
    sourcePill: {
        fontSize: '0.7rem',
        fontWeight: '600',
        padding: '0.15rem 0.55rem',
        borderRadius: '100px',
        letterSpacing: '0.01em',
    },
    meta: {
        fontSize: '0.75rem',
        color: '#aaa',
    },
    title: {
        fontSize: '0.975rem',
        fontWeight: '500',
        lineHeight: '1.45',
        marginBottom: '0.5rem',
        color: '#111',
    },
    titleLink: {
        color: '#111',
        textDecoration: 'none',
    },
    summary: {
        fontSize: '0.865rem',
        color: '#555',
        lineHeight: '1.65',
        marginBottom: '0.75rem',
    },
    tagRow: {
        display: 'flex',
        gap: '0.35rem',
        flexWrap: 'wrap' as const,
    },
    tag: {
        fontSize: '0.72rem',
        color: '#888',
        background: '#f5f5f5',
        border: 'none',
        borderRadius: '4px',
        padding: '0.18rem 0.5rem',
        cursor: 'pointer',
    },
    loadMoreBtn: {
        padding: '0.6rem 1.5rem',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '0.875rem',
        color: '#555',
        cursor: 'pointer',
    },
}