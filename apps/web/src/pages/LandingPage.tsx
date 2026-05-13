// apps/web/src/pages/LandingPage.tsx

import { Link } from 'react-router-dom'

const TOPICS = [
    'LLMs', 'Model releases', 'Research papers',
    'Open source', 'Computer vision', 'AI policy',
    'Startup funding', 'Developer tooling',
]

export function LandingPage() {
    return (
        <div style={styles.page}>

            {/* Navbar */}
            <nav style={styles.nav}>
                <div style={styles.navInner}>
                    <span style={styles.logo}>Holonet.ai</span>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login" style={styles.navLink}>Sign in</Link>
                        <Link to="/signup" style={styles.signupBtn}>Get started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    <div style={styles.heroBadge}>Free · No credit card required</div>
                    <h1 style={styles.heroTitle}>
                        Stay on top of AI.<br />Without the noise.
                    </h1>
                    <p style={styles.heroSubtitle}>
                        We scrape HackerNews, ArXiv, and TechCrunch every 12 hours,
                        summarize every article with AI, and send you a personalized
                        digest of only what you care about — every morning.
                    </p>
                    <div style={styles.heroActions}>
                        <Link to="/signup" style={styles.primaryBtn}>
                            Start your free digest →
                        </Link>
                        <Link to="/login" style={styles.ghostLink}>
                            Already have an account
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={styles.section}>
                <div style={styles.sectionInner}>
                    <h2 style={styles.sectionTitle}>How it works</h2>
                    <div style={styles.steps}>
                        {[
                            {
                                number: '01',
                                title: 'We scrape',
                                desc: 'HackerNews, ArXiv, and TechCrunch are scraped automatically every 12 hours. No manual curation.'
                            },
                            {
                                number: '02',
                                title: 'AI summarizes',
                                desc: 'Every article is sent through an LLM which writes a technically accurate 2-3 sentence summary and tags it by topic.'
                            },
                            {
                                number: '03',
                                title: 'You get your digest',
                                desc: 'Each morning you receive a personalized email with your top 10 articles, filtered by the topics and depth you chose.'
                            },
                        ].map(step => (
                            <div key={step.number} style={styles.step}>
                                <span style={styles.stepNumber}>{step.number}</span>
                                <h3 style={styles.stepTitle}>{step.title}</h3>
                                <p style={styles.stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Topics */}
            <section style={{ ...styles.section, background: '#fff' }}>
                <div style={styles.sectionInner}>
                    <h2 style={styles.sectionTitle}>Pick what matters to you</h2>
                    <p style={styles.sectionSubtitle}>
                        Choose any combination of topics. Your digest only includes articles that match.
                    </p>
                    <div style={styles.topicGrid}>
                        {TOPICS.map(topic => (
                            <span key={topic} style={styles.topicChip}>{topic}</span>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Link to="/signup" style={styles.primaryBtn}>
                            Set up your topics →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <span style={styles.logo}>AI News Digest</span>
                    <p style={styles.footerText}>
                        Built with HackerNews, ArXiv, TechCrunch, and Groq.
                    </p>
                </div>
            </footer>

        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#fafafa',
    },
    nav: {
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky' as const,
        top: 0,
        zIndex: 10,
    },
    navInner: {
        maxWidth: '900px',
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
    signupBtn: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#fff',
        background: '#111',
        padding: '0.45rem 1rem',
        borderRadius: '8px',
        textDecoration: 'none',
    },
    hero: {
        padding: '6rem 1.5rem',
        textAlign: 'center' as const,
    },
    heroInner: {
        maxWidth: '640px',
        margin: '0 auto',
    },
    heroBadge: {
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#666',
        background: '#f0f0f0',
        padding: '0.3rem 0.8rem',
        borderRadius: '100px',
        marginBottom: '1.5rem',
    },
    heroTitle: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: '700',
        color: '#111',
        lineHeight: '1.2',
        marginBottom: '1.25rem',
    },
    heroSubtitle: {
        fontSize: '1.05rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '2.5rem',
    },
    heroActions: {
        display: 'flex',
        gap: '1.25rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
    },
    primaryBtn: {
        display: 'inline-block',
        padding: '0.75rem 1.75rem',
        background: '#111',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '500',
        textDecoration: 'none',
    },
    ghostLink: {
        fontSize: '0.875rem',
        color: '#888',
        textDecoration: 'none',
    },
    section: {
        padding: '5rem 1.5rem',
        background: '#fafafa',
    },
    sectionInner: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: '1.75rem',
        fontWeight: '600',
        color: '#111',
        textAlign: 'center' as const,
        marginBottom: '0.75rem',
    },
    sectionSubtitle: {
        fontSize: '1rem',
        color: '#666',
        textAlign: 'center' as const,
        marginBottom: '2.5rem',
    },
    steps: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    step: {
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '2rem',
    },
    stepNumber: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#bbb',
        letterSpacing: '0.1em',
        display: 'block',
        marginBottom: '0.75rem',
    },
    stepTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#111',
        marginBottom: '0.5rem',
    },
    stepDesc: {
        fontSize: '0.875rem',
        color: '#666',
        lineHeight: '1.65',
        margin: 0,
    },
    topicGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '0.6rem',
        justifyContent: 'center',
    },
    topicChip: {
        padding: '0.45rem 1rem',
        border: '1px solid #e5e5e5',
        borderRadius: '100px',
        fontSize: '0.875rem',
        color: '#444',
        background: '#fff',
    },
    footer: {
        borderTop: '1px solid #e5e5e5',
        padding: '2rem 1.5rem',
        background: '#fff',
    },
    footerInner: {
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
        gap: '0.5rem',
    },
    footerText: {
        fontSize: '0.8rem',
        color: '#aaa',
        margin: 0,
    },
}