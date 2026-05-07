// packages/shared/src/types/article.types.ts
export type TopicTag =
    | 'llm'
    | 'model-release'
    | 'research-paper'
    | 'open-source'
    | 'computer-vision'
    | 'policy'
    | 'startup-funding'
    | 'tooling'
    | 'robotics'
    | 'multimodal'

export type TechnicalDepth = 1 | 2 | 3 | 4 | 5

export interface Article {
    id: string
    title: string
    url: string
    source: 'hackernews' | 'arxiv' | 'venturebeat'
    summary: string
    tags: TopicTag[]
    technicalDepth: TechnicalDepth
    publishedAt: string
    createdAt: string
}