import { AnalyzeArticle } from './src/services/llm.service'

async function main() {
  console.log('Testing Groq LLM...')
  
  const title = "CUDA-oxide: Nvidia's official Rust to CUDA compiler"
  const content = "This is a test article about CUDA and Rust compilers. It's an important development for system programming."
  
  const result = await AnalyzeArticle(title, content)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main().catch(console.error)
