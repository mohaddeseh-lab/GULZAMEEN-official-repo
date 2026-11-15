import { createClient } from '@supabase/supabase-js'

// CHANGED: the client is created on first use, not when the file is loaded.
// Before, `next build` crashed with "supabaseKey is required" whenever the key was
// not available at build time. Now the key is only needed when a request runs.
let client
function getClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
  return client
}

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabaseAdmin = /** @type {any} */ (new Proxy(
  {},
  {
    get(_target, prop) {
      const c = getClient()
      const value = c[prop]
      return typeof value === 'function' ? value.bind(c) : value
    },
  }
))