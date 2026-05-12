import { GoogleGenerativeAI } from '@google/generative-ai'

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  console.log('API Key loaded:', apiKey ? 'Yes' : 'No')
  console.log('Key prefix:', apiKey?.substring(0, 10))
  
  const genAI = new GoogleGenerativeAI(apiKey!)
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent('Hello, what is 2+2?')
    const text = result.response.text()
    console.log('✓ API key works!')
    console.log('Response:', text)
  } catch (err) {
    console.log('✗ Error:')
    console.log(err)
  }
}

main()
