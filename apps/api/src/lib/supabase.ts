// apps/api/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Service role client — has admin access, never use this on frontend
// Used for: verifying JWTs, managing users server-side
export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)