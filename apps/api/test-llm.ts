import { AnalyzeArticle } from './src/services/llm.service'

async function main() {
  console.log('Testing LLM with sample article...')
  
  const title = "CUDA-oxide: Nvidia's official Rust to CUDA compiler"
  const content = "This is a test article about CUDA and Rust compilers."
  
  const result = await AnalyzeArticle(title, content)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main().catch(console.error)
