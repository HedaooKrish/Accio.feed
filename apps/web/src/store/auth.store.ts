// apps/web/src/store/auth.store.ts
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
    id: string
    email: string
}

interface AuthStore {
    user: User | null
    token: string | null
    loading: boolean
    setUser: (user: User | null, token: string | null) => void
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    loading: true, // starts true while we check if a session already exists

    setUser: (user, token) => set({ user, token, loading: false }),

    logout: async () => {
        // Sign out from Supabase (clears the local session)
        await supabase.auth.signOut()
        set({ user: null, token: null, loading: false })
    }
}))