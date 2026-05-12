// apps/api/src/services/llm.service.ts

import Groq from 'groq-sdk'
import { logger } from '../lib/logger'

// Groq runs Llama 3 at very high speed — free tier is generous
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY!
})

export interface ArticleAnalysis {
    summary: string
    tags: string[]
    technicalDepth: number
}

const VALID_TAGS = [
    'llm', 'model-release', 'research-paper', 'open-source',
    'computer-vision', 'policy', 'startup-funding', 'tooling',
    'robotics', 'multimodal'
]

export async function analyzeArticle(
    title: string,
    content: string
): Promise<ArticleAnalysis | null> {
    try {
        const truncated = content.slice(0, 3000)

        const response = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // best free model on Groq
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI news analyst. Always respond with valid JSON only. No markdown, no backticks, no explanation whatsoever.'
                },
                {
                    role: 'user',
                    content: `
Analyze this article and return ONLY a JSON object.

Title: ${title}
Content: ${truncated}

Return exactly this structure:
{
  "summary": "2-3 sentences. Preserve technical accuracy. Do not simplify terms.",
  "tags": ["1-3 tags chosen ONLY from: llm, model-release, research-paper, open-source, computer-vision, policy, startup-funding, tooling, robotics, multimodal"],
  "technicalDepth": <integer 1-5: 1=general news, 2=some tech, 3=engineering detail, 4=research, 5=arxiv paper>
}
`
                }
            ],
            temperature: 0.1,
        })

        const text = response.choices[0]?.message?.content?.trim()
        if (!text) throw new Error('Empty response from Groq')

        const cleaned = text
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()

        const parsed = JSON.parse(cleaned) as ArticleAnalysis

        return {
            summary: typeof parsed.summary === 'string'
                ? parsed.summary.slice(0, 500)
                : 'Summary unavailable.',
            tags: Array.isArray(parsed.tags)
                ? parsed.tags.filter(t => VALID_TAGS.includes(t))
                : [],
            technicalDepth: typeof parsed.technicalDepth === 'number'
                ? Math.min(5, Math.max(1, Math.round(parsed.technicalDepth)))
                : 2
        }

    } catch (err) {
        logger.error({ err, title }, 'LLM analysis failed')
        return null
    }
}