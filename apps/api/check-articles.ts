import { db } from './src/lib/db'

async function main() {
  const processed = await db.article.count({
    where: { processedAt: { not: null } }
  })
  const unprocessed = await db.article.count({
    where: { processedAt: null }
  })
  
  console.log(`Processed: ${processed}, Unprocessed: ${unprocessed}`)
}

main().catch(console.error)
