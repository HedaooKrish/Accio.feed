// apps/web/src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' }
})

// Global error logging
api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('[API Error]', err.response?.data?.error || err.message)
        return Promise.reject(err)
    }
)