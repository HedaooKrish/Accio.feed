import { useState, useEffect } from "react";
import { api } from './lib/api'

function App() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    api.get('/health')
      .then(res => setStatus(res.data.data.status))
      .catch(() => setStatus('API unavailable'))

  }, [])

  return (
    <div style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <h1>AI News Aggregator</h1>
      <p>API Status: <strong>{status}</strong></p>
    </div>
  )
}

export default App;