import { createClient } from '@supabase/supabase-js'

// The connection is created on first use, never while the file is loaded, so `next build`
// works even when the secret key is not available at build time.
let client

/** @returns {import('@supabase/supabase-js').SupabaseClient} */
export function getSupabaseAdmin() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
  return client
}

// Same connection under the older name, so routes using either style keep working:
//   import { supabaseAdmin } from '.../lib/supabaseAdmin'     (supabaseAdmin.from(...))
//   import { getSupabaseAdmin } from '.../lib/supabaseAdmin'  (getSupabaseAdmin().from(...))
/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabaseAdmin = /** @type {any} */ (
  new Proxy(
    {},
    {
      get(_target, prop) {
        const c = getSupabaseAdmin()
        const value = c[prop]
        return typeof value === 'function' ? value.bind(c) : value
      },
    }
  )
)