// apps/web/src/lib/api.ts — replace existing content

import axios from 'axios'
import { useAuthStore } from '../store/auth.store'

// Base axios instance pointing at our API
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' }
})

// Request interceptor — automatically adds the JWT token to every request
// This runs before every API call so we never forget to add auth headers
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Response interceptor — if token expired, log the user out automatically
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            useAuthStore.getState().logout()
        }
        return Promise.reject(err)
    }
)