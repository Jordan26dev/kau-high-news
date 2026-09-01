import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    // friendly dev-time warning if env vars are missing
    // avoid throwing at import time to keep builds smooth
    // eslint-disable-next-line no-console
    console.warn('Supabase env vars are missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export default supabase
