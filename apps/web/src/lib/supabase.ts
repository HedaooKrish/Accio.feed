// apps/web/src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

// Anon key is safe to use on the frontend — it has limited permissions
// Supabase Row Level Security policies control what it can actually access

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)