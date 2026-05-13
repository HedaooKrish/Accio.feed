// apps/api/src/emails/DigestEmail.tsx
import React from 'react'
import {
    Html, Head, Body, Container, Section,
    Text, Link, Hr, Preview, Heading
} from '@react-email/components'

interface Article {
    id: string
    title: string
    url: string
    source: string
    summary: string | null  // can be null from DB
    tags: string[]
    technicalDepth: number | null  // can be null from DB
}

interface DigestEmailProps {
    userEmail: string
    articles: Article[]
    digestDate: string // e.g. "Monday, May 13"
}

// Source display names
const SOURCE_LABEL: Record<string, string> = {
    hackernews: 'Hacker News',
    arxiv: 'ArXiv',
    venturebeat: 'TechCrunch',
}

export function DigestEmail({ userEmail, articles, digestDate }: DigestEmailProps) {
    const featured = articles[0]       // first article gets hero treatment
    const rest = articles.slice(1) // remaining 9 are compact

    return (
        <Html>
            <Head />
            <Preview>Your AI news digest for {digestDate}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>

                    {/* Header */}
                    <Section style={styles.header}>
                        <Text style={styles.logo}>AI News Digest</Text>
                        <Text style={styles.date}>{digestDate}</Text>
                    </Section>

                    <Hr style={styles.divider} />

                    {/* Featured story */}
                    {featured && (
                        <Section style={styles.featured}>
                            <Text style={styles.featuredLabel}>TOP STORY</Text>
                            <Heading style={styles.featuredTitle}>
                                <Link href={featured.url} style={styles.featuredLink}>
                                    {featured.title}
                                </Link>
                            </Heading>
                            <Text style={styles.featuredSummary}>{featured.summary}</Text>
                            <Text style={styles.featuredMeta}>
                                {SOURCE_LABEL[featured.source] || featured.source}
                                {' · '}
                                {featured.tags.join(', ')}
                            </Text>
                        </Section>
                    )}

                    <Hr style={styles.divider} />

                    {/* Rest of articles */}
                    {rest.length > 0 && (
                        <Section>
                            <Text style={styles.sectionTitle}>More from today</Text>
                            {rest.map((article, i) => (
                                <Section key={article.id} style={styles.articleRow}>
                                    <Text style={styles.articleMeta}>
                                        {SOURCE_LABEL[article.source] || article.source}
                                    </Text>
                                    <Text style={styles.articleTitle}>
                                        <Link href={article.url} style={styles.articleLink}>
                                            {article.title}
                                        </Link>
                                    </Text>
                                    {article.summary && (
                                        <Text style={styles.articleSummary}>{article.summary}</Text>
                                    )}
                                    {i < rest.length - 1 && <Hr style={styles.thinDivider} />}
                                </Section>
                            ))}
                        </Section>
                    )}

                    <Hr style={styles.divider} />

                    {/* Footer */}
                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            Sent to {userEmail}
                        </Text>
                        <Text style={styles.footerText}>
                            AI News Digest — personalized AI news, delivered daily
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}

const styles = {
    body: {
        backgroundColor: '#fafafa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        overflow: 'hidden' as const,
    },
    header: {
        padding: '32px 40px 24px',
    },
    logo: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111',
        margin: '0 0 4px',
    },
    date: {
        fontSize: '13px',
        color: '#888',
        margin: '0',
    },
    divider: {
        borderColor: '#e5e5e5',
        margin: '0',
    },
    thinDivider: {
        borderColor: '#f0f0f0',
        margin: '16px 0',
    },
    featured: {
        padding: '32px 40px',
    },
    featuredLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#888',
        letterSpacing: '0.08em',
        margin: '0 0 12px',
    },
    featuredTitle: {
        fontSize: '22px',
        fontWeight: '600',
        lineHeight: '1.3',
        color: '#111',
        margin: '0 0 12px',
    },
    featuredLink: {
        color: '#111',
        textDecoration: 'none',
    },
    featuredSummary: {
        fontSize: '15px',
        lineHeight: '1.65',
        color: '#444',
        margin: '0 0 12px',
    },
    featuredMeta: {
        fontSize: '12px',
        color: '#999',
        margin: '0',
    },
    sectionTitle: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#888',
        letterSpacing: '0.08em',
        padding: '24px 40px 0',
        margin: '0',
    },
    articleRow: {
        padding: '16px 40px',
    },
    articleMeta: {
        fontSize: '11px',
        color: '#aaa',
        margin: '0 0 4px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
    },
    articleTitle: {
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '1.4',
        color: '#111',
        margin: '0 0 6px',
    },
    articleLink: {
        color: '#111',
        textDecoration: 'none',
    },
    articleSummary: {
        fontSize: '13px',
        lineHeight: '1.6',
        color: '#666',
        margin: '0',
    },
    footer: {
        padding: '24px 40px 32px',
        backgroundColor: '#fafafa',
    },
    footerText: {
        fontSize: '12px',
        color: '#aaa',
        margin: '0 0 4px',
        textAlign: 'center' as const,
    },
}