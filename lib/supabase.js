import { createClient } from '@supabase/supabase-js'

// CHANGED: created on first use (see supabaseAdmin.js)
let client
function getClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return client
}

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabase = /** @type {any} */ (new Proxy(
  {},
  {
    get(_target, prop) {
      const c = getClient()
      const value = c[prop]
      return typeof value === 'function' ? value.bind(c) : value
    },
  }
))