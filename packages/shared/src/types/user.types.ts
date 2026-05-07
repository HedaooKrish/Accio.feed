// packages/shared/src/types/user.types.ts
import { TopicTag, TechnicalDepth } from './article.types'

export interface UserPreferences {
    topics: TopicTag[]
    minTechnicalDepth: TechnicalDepth
    digestFrequency: 'daily' | 'weekly'
}